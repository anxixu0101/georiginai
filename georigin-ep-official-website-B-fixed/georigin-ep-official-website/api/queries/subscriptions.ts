import { sql } from "drizzle-orm";
import { getDb } from "./connection";
import { subscriptions } from "../../db/schema";

// db:push is the primary schema-sync path. This idempotent bootstrap only
// runs as a fallback when the table is missing (e.g. db:push could not reach
// the database from the build sandbox).
let bootstrapPromise: Promise<void> | null = null;
function ensureTable(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const db = getDb();
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id bigint unsigned NOT NULL AUTO_INCREMENT,
          email varchar(320) NOT NULL,
          source varchar(64) NOT NULL DEFAULT 'website',
          created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY subscriptions_email_unique (email)
        )
      `);
    })().catch((err) => {
      bootstrapPromise = null;
      throw err;
    });
  }
  return bootstrapPromise;
}

function isMissingTable(err: unknown): boolean {
  const msg = String((err as { message?: string })?.message ?? err);
  return /doesn't exist|ER_NO_SUCH_TABLE|1146/i.test(msg);
}

export async function insertSubscription(email: string, source: string) {
  const db = getDb();
  try {
    await db
      .insert(subscriptions)
      .values({ email, source })
      .onDuplicateKeyUpdate({ set: { email } });
  } catch (err) {
    if (!isMissingTable(err)) throw err;
    await ensureTable();
    await db
      .insert(subscriptions)
      .values({ email, source })
      .onDuplicateKeyUpdate({ set: { email } });
  }
  return { ok: true as const };
}
