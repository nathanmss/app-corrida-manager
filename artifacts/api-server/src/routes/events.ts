import { Router, type IRouter } from "express";
import { db, eventsTable, routesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/events/active", async (req, res) => {
  try {
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.status, "active"))
      .limit(1);

    if (!event) {
      res.status(404).json({ error: "Nenhum evento ativo encontrado." });
      return;
    }

    const routes = await db
      .select()
      .from(routesTable)
      .where(eq(routesTable.eventId, event.id));

    res.json({
      id: event.id,
      name: event.name,
      description: event.description,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      location: event.location,
      registrationDeadline: event.registrationDeadline,
      status: event.status,
      routes: routes.map((r) => ({
        id: r.id,
        name: r.name,
        distanceKm: r.distanceKm,
        description: r.description,
        participantLimit: r.participantLimit,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get active event");
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;
