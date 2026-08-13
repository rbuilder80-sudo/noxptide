import { authRouter } from "./auth-router";
import { ordersRouter } from "./orders-router";
import { usersRouter } from "./users-router";
import { cmsRouter } from "./cms-router";
import { productsRouter } from "./products-router";
import { integrationsRouter } from "./integrations-router";
import { discountsRouter } from "./discounts-router";
import { customersRouter } from "./customers-router";
import { analyticsRouter } from "./analytics-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  // TEMPORARY debug probe — remove after discounts migration is verified.
  dbDebug: publicQuery.query(async () => {
    const { getDb } = await import("./queries/connection");
    const { sql } = await import("drizzle-orm");
    const db = getDb();
    const out: Record<string, unknown> = {};
    try {
      out.discounts = await db.execute(sql`select count(*) as n from discounts`);
    } catch (e) {
      out.discountsError = String((e as Error).message).slice(0, 300);
      out.discountsCause = String((e as { cause?: Error }).cause?.message ?? "").slice(0, 300);
    }
    try {
      out.journal = await db.execute(sql`select tag, created_at from __drizzle_migrations order by id`);
    } catch (e) {
      out.journalError = String((e as { cause?: Error }).cause?.message ?? (e as Error).message).slice(0, 300);
    }
    try {
      out.orderCols = await db.execute(sql`show columns from orders like 'discountCode'`);
    } catch (e) {
      out.orderColsError = String((e as { cause?: Error }).cause?.message ?? (e as Error).message).slice(0, 300);
    }
    return out;
  }),
  auth: authRouter,
  orders: ordersRouter,
  users: usersRouter,
  cms: cmsRouter,
  products: productsRouter,
  integrations: integrationsRouter,
  discounts: discountsRouter,
  customers: customersRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
