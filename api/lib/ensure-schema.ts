import { sql } from "drizzle-orm";
import { getDb } from "../queries/connection";

/**
 * Idempotent schema guard for the sales-backend tables/columns.
 * drizzle-kit migrations assume a linear journal, but this project's prod DB
 * was partially managed via `db:push`, so the journal can diverge and the
 * migrator may stop before reaching newer migrations. Every statement here
 * is IF NOT EXISTS-guarded and safe to run on every boot.
 */
const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS discounts (
    id serial AUTO_INCREMENT NOT NULL,
    code varchar(32) NOT NULL,
    description varchar(255),
    type enum('percent','fixed') NOT NULL,
    value int NOT NULL,
    minSubtotalPence int NOT NULL DEFAULT 0,
    maxUses int,
    usedCount int NOT NULL DEFAULT 0,
    startsAt timestamp,
    expiresAt timestamp,
    active boolean NOT NULL DEFAULT true,
    createdBy varchar(255),
    createdAt timestamp NOT NULL DEFAULT (now()),
    updatedAt timestamp NOT NULL DEFAULT (now()),
    PRIMARY KEY (id),
    UNIQUE KEY discounts_code_unique (code)
  )`,
  `CREATE TABLE IF NOT EXISTS product_overrides (
    id serial AUTO_INCREMENT NOT NULL,
    productSlug varchar(128) NOT NULL,
    name varchar(255),
    tagline varchar(255),
    description text,
    categorySlug varchar(128),
    imageUrl text,
    detailsJson text,
    updatedBy varchar(255),
    updatedAt timestamp NOT NULL DEFAULT (now()),
    PRIMARY KEY (id),
    UNIQUE KEY product_overrides_productSlug_unique (productSlug)
  )`,
  `CREATE TABLE IF NOT EXISTS refunds (
    id serial AUTO_INCREMENT NOT NULL,
    orderId bigint unsigned NOT NULL,
    amountPence int NOT NULL,
    reason text,
    createdBy varchar(255),
    createdAt timestamp NOT NULL DEFAULT (now()),
    PRIMARY KEY (id)
  )`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS discountCode varchar(32)`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS promoDiscountPence int DEFAULT 0 NOT NULL`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS refundedPence int DEFAULT 0 NOT NULL`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier varchar(64)`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS trackingNumber varchar(64)`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS passwordHash varchar(255)`,
];

export async function ensureSalesBackendSchema() {
  const db = getDb();
  const failures: string[] = [];
  for (const statement of STATEMENTS) {
    try {
      await db.execute(sql.raw(statement));
    } catch (err) {
      failures.push(`${statement.slice(0, 60)}… → ${String((err as { cause?: Error }).cause?.message ?? (err as Error).message).slice(0, 120)}`);
    }
  }
  if (failures.length) {
    console.warn("[db] ensure-schema failures:", failures);
  } else {
    console.log("[db] sales backend schema ensured");
  }

  // Seed the local admin login (email/password) — self-hosted site, Kimi
  // OAuth only accepts its original platform redirect URI. Only inserts when
  // no local admin row exists; never overwrites an existing password.
  try {
    const db2 = getDb();
    await db2.execute(sql.raw(
      `INSERT INTO users (unionId, name, email, role, passwordHash, lastSignInAt)
       SELECT 'local:rbuilder@gmail.com', 'Rob (Owner)', 'rbuilder@gmail.com', 'admin',
              'scrypt:3f6708efb044a0615e5d9acc74c74cf4:e187fe4a9884cda67398bfe5ed03a54fda1661cea043343469124bf156dbf16744b0e62b2dec085505a7098a217f3901f7a7be04c7dbb6b62c00a98002db573c',
              NOW()
       FROM DUAL
       WHERE NOT EXISTS (SELECT 1 FROM users WHERE unionId = 'local:rbuilder@gmail.com')`,
    ));
  } catch (err) {
    console.warn("[db] admin seed skipped:", (err as Error).message);
  }
  return failures;
}
