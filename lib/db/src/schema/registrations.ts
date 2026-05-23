import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, integer, boolean, date, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { eventsTable } from "./events";
import { routesTable } from "./routes";

export const registrationsTable = pgTable(
  "registrations",
  {
    id: serial("id").primaryKey(),
    registrationCode: text("registration_code").notNull().unique(),
    eventId: integer("event_id").notNull().references(() => eventsTable.id),
    routeId: integer("route_id").notNull().references(() => routesTable.id),
    fullName: text("full_name").notNull(),
    cpf: text("cpf").notNull(),
    whatsapp: text("whatsapp").notNull(),
    email: text("email"),
    birthDate: date("birth_date").notNull(),
    sex: text("sex").notNull(),
    city: text("city"),
    neighborhood: text("neighborhood"),
    team: text("team"),
    shirtSize: text("shirt_size"),
    medicalNotes: text("medical_notes"),
    emergencyContactName: text("emergency_contact_name"),
    emergencyContactWhatsapp: text("emergency_contact_whatsapp"),
    status: text("status").notNull().default("inscrito"),
    acceptedTerms: boolean("accepted_terms").notNull().default(false),
    acceptedTermsAt: timestamp("accepted_terms_at", { withTimezone: true }),
    termsVersion: text("terms_version"),
    internalNotes: text("internal_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("registrations_event_cpf_active_unique")
      .on(table.eventId, table.cpf)
      .where(sql`${table.status} <> 'cancelado'`),
  ],
);

export const insertRegistrationSchema = createInsertSchema(registrationsTable).omit({ id: true, createdAt: true, updatedAt: true, registrationCode: true });
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrationsTable.$inferSelect;
