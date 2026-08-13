import { z } from "zod";
import { and, desc, eq, gte, lte, ne, sql } from "drizzle-orm";
import { orders, orderItems, productVariants } from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, staffQuery } from "./middleware";

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export const analyticsRouter = createRouter({
  /** Staff: headline KPIs for the admin dashboard. */
  overview: staffQuery.query(async () => {
    const db = getDb();
    const since = daysAgo(30);

    const [revenue] = await db
      .select({
        revenuePence: sql<number>`COALESCE(SUM(${orders.totalPence}), 0)`,
        orders: sql<number>`COUNT(*)`,
      })
      .from(orders)
      .where(and(gte(orders.createdAt, since), ne(orders.status, "cancelled")));

    const [pending] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(orders)
      .where(eq(orders.status, "pending"));

    const lowStock = await db
      .select({
        productSlug: productVariants.productSlug,
        sizeLabel: productVariants.sizeLabel,
        stock: productVariants.stock,
      })
      .from(productVariants)
      .where(lte(productVariants.stock, 5))
      .orderBy(productVariants.stock);

    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    const orders30d = Number(revenue?.orders ?? 0);
    const revenue30dPence = Number(revenue?.revenuePence ?? 0);
    return {
      revenue30dPence,
      orders30d,
      aov30dPence: orders30d > 0 ? Math.round(revenue30dPence / orders30d) : 0,
      pendingOrders: Number(pending?.count ?? 0),
      lowStock,
      recentOrders,
    };
  }),

  /** Staff: daily revenue for the last N days, excluding cancelled orders. */
  revenueByDay: staffQuery
    .input(z.object({ days: z.number().int().min(1).max(365).default(30) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const days = input?.days ?? 30;
      const rows = await db
        .select({
          day: sql<string>`DATE_FORMAT(${orders.createdAt}, '%Y-%m-%d')`,
          revenuePence: sql<number>`COALESCE(SUM(${orders.totalPence}), 0)`,
          orders: sql<number>`COUNT(*)`,
        })
        .from(orders)
        .where(and(gte(orders.createdAt, daysAgo(days)), ne(orders.status, "cancelled")))
        .groupBy(sql`DATE_FORMAT(${orders.createdAt}, '%Y-%m-%d')`)
        .orderBy(sql`DATE_FORMAT(${orders.createdAt}, '%Y-%m-%d')`);
      return rows.map((row) => ({
        day: row.day,
        revenuePence: Number(row.revenuePence),
        orders: Number(row.orders),
      }));
    }),

  /** Staff: best-selling products over the last N days (non-cancelled orders). */
  topProducts: staffQuery
    .input(
      z
        .object({
          days: z.number().int().min(1).max(365).default(30),
          limit: z.number().int().min(1).max(50).default(8),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const days = input?.days ?? 30;
      const limit = input?.limit ?? 8;
      const rows = await db
        .select({
          productSlug: orderItems.productSlug,
          productName: orderItems.productName,
          qty: sql<number>`COALESCE(SUM(${orderItems.qty}), 0)`,
          revenuePence: sql<number>`COALESCE(SUM(${orderItems.unitPricePence} * ${orderItems.qty}), 0)`,
        })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(and(gte(orders.createdAt, daysAgo(days)), ne(orders.status, "cancelled")))
        .groupBy(orderItems.productSlug, orderItems.productName)
        .orderBy(desc(sql`COALESCE(SUM(${orderItems.qty}), 0)`))
        .limit(limit);
      return rows.map((row) => ({
        productSlug: row.productSlug,
        productName: row.productName,
        qty: Number(row.qty),
        revenuePence: Number(row.revenuePence),
      }));
    }),
});
