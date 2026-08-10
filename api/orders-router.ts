import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { orders, orderItems } from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, publicQuery, staffQuery } from "./middleware";

const orderInput = z.object({
  customerName: z.string().min(2).max(255),
  email: z.string().email().max(320),
  phone: z.string().max(64).optional(),
  addressLine1: z.string().min(3).max(255),
  addressLine2: z.string().max(255).optional(),
  city: z.string().min(2).max(128),
  postcode: z.string().min(3).max(16),
  country: z.string().max(64).default("United Kingdom"),
  subtotalPence: z.number().int().nonnegative(),
  discountPence: z.number().int().nonnegative(),
  shippingPence: z.number().int().nonnegative(),
  totalPence: z.number().int().positive(),
  notes: z.string().max(2000).optional(),
  items: z
    .array(
      z.object({
        productSlug: z.string().max(128),
        productName: z.string().max(255),
        sizeLabel: z.string().max(32),
        unitPricePence: z.number().int().nonnegative(),
        qty: z.number().int().positive(),
      }),
    )
    .min(1),
});

const orderStatuses = [
  "pending",
  "paid",
  "processing",
  "dispatched",
  "completed",
  "cancelled",
] as const;

export const ordersRouter = createRouter({
  /** Public: place an order from checkout. */
  create: publicQuery.input(orderInput).mutation(async ({ input }) => {
    const db = getDb();
    const orderNumber = `NOX-${Date.now().toString(36).toUpperCase()}${Math.floor(
      Math.random() * 900 + 100,
    )}`;
    const { items, ...fields } = input;
    const [result] = await db.insert(orders).values({ ...fields, orderNumber });
    const orderId = result.insertId;
    await db.insert(orderItems).values(items.map((it) => ({ ...it, orderId })));
    return { success: true, orderNumber, orderId };
  }),

  /** Staff: list all orders, newest first. */
  list: staffQuery.query(async () => {
    const db = getDb();
    return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(500);
  }),

  /** Staff: single order with its items. */
  get: staffQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [order] = await db.select().from(orders).where(eq(orders.id, input.id));
      if (!order) return null;
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, input.id));
      return { ...order, items };
    }),

  /** Staff: update status / internal notes (e.g. mark completed). */
  updateStatus: staffQuery
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(orderStatuses),
        notes: z.string().max(2000).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(orders)
        .set({ status: input.status, ...(input.notes !== undefined ? { notes: input.notes } : {}) })
        .where(eq(orders.id, input.id));
      return { success: true };
    }),
});
