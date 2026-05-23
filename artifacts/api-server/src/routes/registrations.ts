import { Router, type IRouter } from "express";
import { db, registrationsTable, eventsTable, routesTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { CreateRegistrationBody } from "@workspace/api-zod";
import crypto from "crypto";

const router: IRouter = Router();

function generateCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

function toDateOnlyString(value: Date): string {
  return value.toISOString().split("T")[0];
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

router.post("/registrations", async (req, res) => {
  try {
    const parsed = CreateRegistrationBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Dados inválidos. Verifique os campos e tente novamente." });
      return;
    }

    const data = parsed.data;
    const birthDate = toDateOnlyString(data.birthDate);
    const cpf = normalizeCpf(data.cpf);

    if (!isValidCpf(cpf)) {
      res.status(400).json({ error: "CPF inválido. Confira os números informados." });
      return;
    }

    if (!data.acceptedTerms) {
      res.status(400).json({ error: "É necessário aceitar o termo de responsabilidade." });
      return;
    }

    if (Boolean(data.emergencyContactName?.trim()) !== Boolean(data.emergencyContactWhatsapp?.trim())) {
      res.status(400).json({
        error: "Informe nome e WhatsApp do contato de emergência, ou deixe os dois campos em branco.",
      });
      return;
    }

    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, data.eventId)).limit(1);
    if (!event || event.status !== "active") {
      res.status(400).json({ error: "Evento não encontrado ou não está ativo." });
      return;
    }

    const [route] = await db.select().from(routesTable).where(eq(routesTable.id, data.routeId)).limit(1);
    if (!route) {
      res.status(400).json({ error: "Percurso não encontrado." });
      return;
    }

    const existing = await db
      .select()
      .from(registrationsTable)
      .where(
        and(
          eq(registrationsTable.eventId, data.eventId),
          eq(registrationsTable.cpf, cpf),
          sql`${registrationsTable.status} <> 'cancelado'`
        )
      )
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({
        error:
          "Já existe uma inscrição ativa com este CPF para este evento. Caso precise corrigir alguma informação, entre em contato com a organização.",
      });
      return;
    }

    const registrationCode = generateCode();
    const TERMS_VERSION = "2026-05-18-v1";

    const [reg] = await db
      .insert(registrationsTable)
      .values({
        registrationCode,
        eventId: data.eventId,
        routeId: data.routeId,
        fullName: data.fullName,
        cpf,
        whatsapp: data.whatsapp,
        email: data.email ?? null,
        birthDate,
        sex: data.sex,
        city: data.city ?? null,
        neighborhood: data.neighborhood ?? null,
        team: data.team ?? null,
        shirtSize: data.shirtSize ?? null,
        medicalNotes: data.medicalNotes ?? null,
        emergencyContactName: data.emergencyContactName?.trim() || null,
        emergencyContactWhatsapp: data.emergencyContactWhatsapp?.trim() || null,
        acceptedTerms: data.acceptedTerms,
        acceptedTermsAt: data.acceptedTerms ? new Date() : null,
        termsVersion: data.acceptedTerms ? (data.termsVersion ?? TERMS_VERSION) : null,
        status: "inscrito",
      })
      .returning();

    res.status(201).json({
      id: reg.id,
      registrationCode: reg.registrationCode,
      fullName: reg.fullName,
      routeName: route.name,
      eventName: event.name,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      location: event.location,
      createdAt: reg.createdAt.toISOString(),
    });
  } catch (err) {
    if (isUniqueCpfViolation(err)) {
      res.status(409).json({
        error:
          "Já existe uma inscrição ativa com este CPF para este evento. Caso precise corrigir alguma informação, entre em contato com a organização.",
      });
      return;
    }
    req.log.error({ err }, "Failed to create registration");
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.get("/registrations/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const [reg] = await db
      .select()
      .from(registrationsTable)
      .where(eq(registrationsTable.registrationCode, code))
      .limit(1);

    if (!reg) {
      res.status(404).json({ error: "Inscrição não encontrada." });
      return;
    }

    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, reg.eventId)).limit(1);
    const [route] = await db.select().from(routesTable).where(eq(routesTable.id, reg.routeId)).limit(1);

    res.json({
      id: reg.id,
      registrationCode: reg.registrationCode,
      fullName: reg.fullName,
      routeName: route?.name ?? "",
      eventName: event?.name ?? "",
      eventDate: event?.eventDate ?? "",
      eventTime: event?.eventTime ?? "",
      location: event?.location ?? "",
      createdAt: reg.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get registration");
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;
