import crypto from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";
import { adminUsersTable, db, pool } from "@workspace/db";

const scryptAsync = promisify(crypto.scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Organização";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL e ADMIN_PASSWORD precisam estar definidos para criar o admin.");
  }

  const passwordHash = await hashPassword(password);
  const [existingAdmin] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, email))
    .limit(1);

  if (existingAdmin) {
    await db
      .update(adminUsersTable)
      .set({ passwordHash, name })
      .where(eq(adminUsersTable.id, existingAdmin.id));
  } else {
    await db.insert(adminUsersTable).values({ email, passwordHash, name });
  }

  console.log(`Admin seed concluído: ${email}`);
}

main()
  .catch((err: unknown) => {
    console.error("Falha ao executar seed do admin.");
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
