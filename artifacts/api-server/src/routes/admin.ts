import { Router, type IRouter, type Request, type Response } from "express";
import { db, registrationsTable, eventsTable, routesTable } from "@workspace/db";
import { eq, and, ilike, or, count, sql, desc, type SQL } from "drizzle-orm";
import { UpdateAdminRegistrationBody, ListAdminRegistrationsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): boolean {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Acesso não autorizado. Faça login para continuar." });
    return false;
  }
  return true;
}

function calculateAge(birthDate: string): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function normalizeCpf(value: string): string {
  return value.replace(/\D/g, "");
}

function isValidCpf(value: string): boolean {
  const cpf = normalizeCpf(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (base: string, factor: number): number => {
    const total = base
      .split("")
      .reduce((sum, digit) => sum + Number(digit) * factor--, 0);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const digit1 = calculateDigit(cpf.slice(0, 9), 10);
  const digit2 = calculateDigit(cpf.slice(0, 10), 11);
  return digit1 === Number(cpf[9]) && digit2 === Number(cpf[10]);
}

function isUniqueCpfViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string; constraint?: string }).code === "23505" &&
    (err as { constraint?: string }).constraint === "registrations_event_cpf_active_unique"
  );
}

function formatRegistration(reg: typeof registrationsTable.$inferSelect, routeName: string) {
  return {
    id: reg.id,
    registrationCode: reg.registrationCode,
    fullName: reg.fullName,
    cpf: reg.cpf,
    whatsapp: reg.whatsapp,
    email: reg.email ?? null,
    birthDate: reg.birthDate,
    age: calculateAge(reg.birthDate),
    sex: reg.sex,
    city: reg.city ?? null,
    neighborhood: reg.neighborhood ?? null,
    team: reg.team ?? null,
    shirtSize: reg.shirtSize ?? null,
    medicalNotes: reg.medicalNotes ?? null,
    emergencyContactName: reg.emergencyContactName ?? null,
    emergencyContactWhatsapp: reg.emergencyContactWhatsapp ?? null,
    routeId: reg.routeId,
    routeName,
    status: reg.status,
    acceptedTerms: reg.acceptedTerms,
    acceptedTermsAt: reg.acceptedTermsAt ? reg.acceptedTermsAt.toISOString() : null,
    termsVersion: reg.termsVersion ?? null,
    internalNotes: reg.internalNotes ?? null,
    createdAt: reg.createdAt.toISOString(),
  };
}

router.get("/admin/stats", async (req, res) => {
  if (!requireAuth(req, res)) return;
  try {
    const [totalRow] = await db.select({ total: count() }).from(registrationsTable);
    const total = totalRow?.total ?? 0;

    const byRouteRaw = await db
      .select({
        routeId: registrationsTable.routeId,
        count: count(),
        routeName: routesTable.name,
        distanceKm: routesTable.distanceKm,
      })
      .from(registrationsTable)
      .leftJoin(routesTable, eq(registrationsTable.routeId, routesTable.id))
      .groupBy(registrationsTable.routeId, routesTable.name, routesTable.distanceKm)
      .orderBy(routesTable.distanceKm);

    const bySexRaw = await db
      .select({ sex: registrationsTable.sex, count: count() })
      .from(registrationsTable)
      .groupBy(registrationsTable.sex);

    const byShirtRaw = await db
      .select({ shirtSize: registrationsTable.shirtSize, count: count() })
      .from(registrationsTable)
      .where(sql`${registrationsTable.shirtSize} is not null`)
      .groupBy(registrationsTable.shirtSize);

    const byStatusRaw = await db
      .select({ status: registrationsTable.status, count: count() })
      .from(registrationsTable)
      .groupBy(registrationsTable.status);

    const recentRaw = await db
      .select()
      .from(registrationsTable)
      .leftJoin(routesTable, eq(registrationsTable.routeId, routesTable.id))
      .orderBy(desc(registrationsTable.createdAt))
      .limit(10);

    res.json({
      total: Number(total),
      byRoute: byRouteRaw.map((r) => ({
        routeName: r.routeName ?? "",
        distanceKm: r.distanceKm ?? 0,
        count: Number(r.count),
      })),
      bySex: bySexRaw.map((r) => ({ sex: r.sex, count: Number(r.count) })),
      byShirt: byShirtRaw.map((r) => ({ shirtSize: r.shirtSize ?? "", count: Number(r.count) })),
      byStatus: byStatusRaw.map((r) => ({ status: r.status, count: Number(r.count) })),
      recentRegistrations: recentRaw.map((r) =>
        formatRegistration(r.registrations, r.routes?.name ?? "")
      ),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get admin stats");
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.get("/admin/registrations", async (req, res) => {
  if (!requireAuth(req, res)) return;
  try {
    const parsed = ListAdminRegistrationsQueryParams.safeParse(req.query);
    const params: typeof ListAdminRegistrationsQueryParams._output = parsed.success
      ? parsed.data
      : { page: 1, pageSize: 50 };
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 50;
    const offset = (page - 1) * pageSize;

    const filters: SQL<unknown>[] = [];
    if (params.search) {
      const searchFilter = or(
        ilike(registrationsTable.fullName, `%${params.search}%`),
        ilike(registrationsTable.cpf, `%${normalizeCpf(params.search) || params.search}%`),
        ilike(registrationsTable.whatsapp, `%${params.search}%`)
      );
      if (searchFilter) filters.push(searchFilter);
    }
    if (params.route) filters.push(eq(routesTable.name, params.route));
    if (params.sex) filters.push(eq(registrationsTable.sex, params.sex));
    if (params.status) filters.push(eq(registrationsTable.status, params.status));
    if (params.shirtSize) filters.push(eq(registrationsTable.shirtSize, params.shirtSize));

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const [totalRow] = await db
      .select({ total: count() })
      .from(registrationsTable)
      .leftJoin(routesTable, eq(registrationsTable.routeId, routesTable.id))
      .where(whereClause);

    const rows = await db
      .select()
      .from(registrationsTable)
      .leftJoin(routesTable, eq(registrationsTable.routeId, routesTable.id))
      .where(whereClause)
      .orderBy(desc(registrationsTable.createdAt))
      .limit(pageSize)
      .offset(offset);

    res.json({
      data: rows.map((r) => formatRegistration(r.registrations, r.routes?.name ?? "")),
      total: Number(totalRow?.total ?? 0),
      page,
      pageSize,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list admin registrations");
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.get("/admin/registrations/:id", async (req, res) => {
  if (!requireAuth(req, res)) return;
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }

    const [row] = await db
      .select()
      .from(registrationsTable)
      .leftJoin(routesTable, eq(registrationsTable.routeId, routesTable.id))
      .where(eq(registrationsTable.id, id))
      .limit(1);

    if (!row) {
      res.status(404).json({ error: "Inscrição não encontrada." });
      return;
    }

    res.json(formatRegistration(row.registrations, row.routes?.name ?? ""));
  } catch (err) {
    req.log.error({ err }, "Failed to get admin registration");
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.patch("/admin/registrations/:id", async (req, res) => {
  if (!requireAuth(req, res)) return;
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }

    const parsed = UpdateAdminRegistrationBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Dados inválidos." });
      return;
    }

    const data = parsed.data;
    const updateData: Partial<typeof registrationsTable.$inferInsert> = {};
    if (data.routeId !== undefined) updateData.routeId = data.routeId;
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.cpf !== undefined) {
      const cpf = normalizeCpf(data.cpf);
      if (!isValidCpf(cpf)) {
        res.status(400).json({ error: "CPF inválido. Confira os números informados." });
        return;
      }
      updateData.cpf = cpf;
    }
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;
    if (data.email !== undefined) updateData.email = data.email ?? null;
    if (data.birthDate !== undefined) updateData.birthDate = data.birthDate;
    if (data.sex !== undefined) updateData.sex = data.sex;
    if (data.city !== undefined) updateData.city = data.city ?? null;
    if (data.neighborhood !== undefined) updateData.neighborhood = data.neighborhood ?? null;
    if (data.team !== undefined) updateData.team = data.team ?? null;
    if (data.shirtSize !== undefined) updateData.shirtSize = data.shirtSize ?? null;
    if (data.medicalNotes !== undefined) updateData.medicalNotes = data.medicalNotes ?? null;
    if (data.emergencyContactName !== undefined) updateData.emergencyContactName = data.emergencyContactName ?? null;
    if (data.emergencyContactWhatsapp !== undefined) updateData.emergencyContactWhatsapp = data.emergencyContactWhatsapp ?? null;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.internalNotes !== undefined) updateData.internalNotes = data.internalNotes ?? null;

    const [updated] = await db
      .update(registrationsTable)
      .set(updateData)
      .where(eq(registrationsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Inscrição não encontrada." });
      return;
    }

    const [route] = await db.select().from(routesTable).where(eq(routesTable.id, updated.routeId)).limit(1);
    res.json(formatRegistration(updated, route?.name ?? ""));
  } catch (err) {
    if (isUniqueCpfViolation(err)) {
      res.status(409).json({
        error:
          "Já existe uma inscrição ativa com este CPF para este evento. Caso precise corrigir alguma informação, entre em contato com a organização.",
      });
      return;
    }
    req.log.error({ err }, "Failed to update admin registration");
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.get("/admin/export", async (req, res) => {
  if (!requireAuth(req, res)) return;
  try {
    const rows = await db
      .select()
      .from(registrationsTable)
      .leftJoin(routesTable, eq(registrationsTable.routeId, routesTable.id))
      .orderBy(registrationsTable.fullName);

    const headers = [
      "Nome completo",
      "CPF",
      "WhatsApp",
      "E-mail",
      "Data de nascimento",
      "Idade",
      "Sexo",
      "Percurso",
      "Cidade",
      "Bairro",
      "Equipe/Assessoria",
      "Tamanho da camisa",
      "Observação médica",
      "Contato de emergência",
      "WhatsApp do contato de emergência",
      "Status",
      "Aceitou os termos",
      "Data do aceite dos termos",
      "Versão dos termos",
      "Data da inscrição",
      "Código",
    ];

    const csvRows = rows.map((r) => {
      const reg = r.registrations;
      const age = calculateAge(reg.birthDate);
      const sexLabel: Record<string, string> = { masculino: "Masculino", feminino: "Feminino", outro: "Outro/Prefiro não informar" };
      return [
        `"${reg.fullName.replace(/"/g, '""')}"`,
        reg.cpf,
        `"${reg.whatsapp.replace(/"/g, '""')}"`,
        `"${(reg.email ?? "").replace(/"/g, '""')}"`,
        reg.birthDate,
        age?.toString() ?? "",
        sexLabel[reg.sex] ?? reg.sex,
        r.routes?.name ?? "",
        `"${(reg.city ?? "").replace(/"/g, '""')}"`,
        `"${(reg.neighborhood ?? "").replace(/"/g, '""')}"`,
        `"${(reg.team ?? "").replace(/"/g, '""')}"`,
        reg.shirtSize ?? "",
        `"${(reg.medicalNotes ?? "").replace(/"/g, '""')}"`,
        `"${(reg.emergencyContactName ?? "").replace(/"/g, '""')}"`,
        `"${(reg.emergencyContactWhatsapp ?? "").replace(/"/g, '""')}"`,
        reg.status,
        reg.acceptedTerms ? "Sim" : "Não",
        reg.acceptedTermsAt ? reg.acceptedTermsAt.toISOString() : "",
        reg.termsVersion ?? "",
        reg.createdAt.toISOString().split("T")[0],
        reg.registrationCode,
      ].join(",");
    });

    const csv = [headers.join(","), ...csvRows].join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="inscricoes-corrida-${new Date().toISOString().split("T")[0]}.csv"`);
    res.send("\uFEFF" + csv);
  } catch (err) {
    req.log.error({ err }, "Failed to export registrations");
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;
