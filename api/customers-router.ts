import { z } from "zod";
import { desc, eq, inArray, like, or, sql } from "drizzle-orm";
import { orders, orderItems } from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, staffQuery } from "./middleware";

export const customersRouter = createRouter({
  /** Staff: customers aggregated from order history, most recent first. */
  list: staffQuery
    .input(
      z
        .object({
          q: z.string().max(255).optional(),
          limit: z.number().int().min(1).max(500).default(100),
          offset: z.number().int().min(0).default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const term = input?.q ? `%${input.q}%` : null;
      return db
        .select({
          email: orders.email,
          customerName: sql<string>`SUBSTRING_INDEX(GROUP_CONCAT(${orders.customerName} ORDER BY ${orders.createdAt} DESC), ',', 1)`,
          ordersCount: sql<number>`COUNT(*)`,
          totalSpentPence: sql<number>`COALESCE(SUM(CASE WHEN ${orders.status} != 'cancelled' THEN ${orders.totalPence} ELSE 0 END), 0)`,
          lastOrderAt: sql<Date>`MAX(${orders.createdAt})`,
        })
        .from(orders)
        .where(term ? or(like(orders.email, term), like(orders.customerName, term)) : undefined)
        .groupBy(orders.email)
        .orderBy(desc(sql`MAX(${orders.createdAt})`))
        .limit(input?.limit ?? 100)
        .offset(input?.offset ?? 0);
    }),

  /** Staff: one customer's aggregates plus full order history with items. */
  detail: staffQuery
    .input(z.object({ email: z.string().email().max(320) }))
    .query(async ({ input }) => {
      const db = getDb();
      const customerOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.email, input.email))
        .orderBy(desc(orders.createdAt));
      if (customerOrders.length === 0) return null;

      const activeOrders = customerOrders.filter((order) => order.status !== "cancelled");
      const aggregates = {
        email: input.email,
        customerName: customerOrders[0].customerName,
        ordersCount: customerOrders.length,
        totalSpentPence: activeOrders.reduce((sum, order) => sum + order.totalPence, 0),
        lastOrderAt: customerOrders[0].createdAt,
      };

      const items = await db
        .select()
        .from(orderItems)
        .where(
          inArray(
            orderItems.orderId,
            customerOrders.map((order) => order.id),
          ),
        );
      return {
        ...aggregates,
        orders: customerOrders.map((order) => ({
          ...order,
          items: items.filter((item) => item.orderId === order.id),
        })),
      };
    }),
});
