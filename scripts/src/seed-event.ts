import { and, eq } from "drizzle-orm";
import { db, eventsTable, pool, routesTable } from "@workspace/db";

const EVENT_NAME = "Treinão Encontro das Águas — 2ª Edição";

const eventSeed = {
  name: EVENT_NAME,
  description:
    "Um treinão comunitário para celebrar o encontro, o movimento e a energia das águas. Escolha seu percurso, confirme sua presença e venha participar com a gente.",
  eventDate: "2026-07-05",
  eventTime: "06:00",
  location: "Encontro das Águas",
  registrationDeadline: null,
  status: "active",
};

const routeSeeds = [
  {
    name: "3 km",
    distanceKm: 3,
    description: "Ideal para iniciantes, caminhada e corrida leve.",
    participantLimit: null,
    active: true,
  },
  {
    name: "5 km",
    distanceKm: 5,
    description: "Percurso intermediário para quem já pratica corrida.",
    participantLimit: null,
    active: true,
  },
  {
    name: "10 km",
    distanceKm: 10,
    description: "Desafio para atletas mais experientes.",
    participantLimit: null,
    active: true,
  },
];

async function upsertEvent() {
  const [existingEvent] = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.name, EVENT_NAME))
    .limit(1);

  if (existingEvent) {
    const [updatedEvent] = await db
      .update(eventsTable)
      .set(eventSeed)
      .where(eq(eventsTable.id, existingEvent.id))
      .returning();

    return updatedEvent;
  }

  const [createdEvent] = await db.insert(eventsTable).values(eventSeed).returning();
  return createdEvent;
}

async function upsertRoutes(eventId: number) {
  for (const routeSeed of routeSeeds) {
    const [existingRoute] = await db
      .select()
      .from(routesTable)
      .where(and(eq(routesTable.eventId, eventId), eq(routesTable.name, routeSeed.name)))
      .limit(1);

    if (existingRoute) {
      await db
        .update(routesTable)
        .set({ ...routeSeed, eventId })
        .where(eq(routesTable.id, existingRoute.id));
      continue;
    }

    await db.insert(routesTable).values({ ...routeSeed, eventId });
  }
}

async function main() {
  const event = await upsertEvent();
  await upsertRoutes(event.id);

  console.log(`Seed concluído: ${EVENT_NAME}`);
  console.log("Percursos: 3 km, 5 km, 10 km");
}

main()
  .catch((err: unknown) => {
    console.error("Falha ao executar seed do evento.");
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
