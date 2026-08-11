import { randomBytes } from "node:crypto";
import { z } from "zod";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { orders, orderItems, productStatuses, productVariants, type Order } from "@db/schema";
import { categories, getProduct } from "@/data/products";
import { getDb } from "./queries/connection";
import { createRouter, publicQuery, staffQuery } from "./middleware";
import { syncOrderToHubSpot } from "./lib/hubspot";
import {
  checkWallidReadiness,
  createWallidPayment,
  getWallidPaymentStatus,
  type WallidItem,
  type WallidPaymentStatus,
  type WallidWebhookEvent,
} from "./lib/wallid";

const orderInput = z.object({
  customerName: z.string().min(2).max(255),
  email: z.string().email().max(320),
  phone: z.string().max(64).optional(),
  organisation: z.string().min(2).max(255),
  addressLine1: z.string().min(3).max(255),
  addressLine2: z.string().max(255).optional(),
  city: z.string().min(2).max(128),
  postcode: z.string().min(3).max(16),
  country: z.literal("United Kingdom").default("United Kingdom"),
  shippingMethod: z.enum(["standard", "next-day"]),
  items: z
    .array(
      z.object({
        productSlug: z.string().max(128),
        sizeLabel: z.string().max(32),
        qty: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(50),
});

const paymentLookupInput = z.object({
  orderNumber: z.string().min(6).max(32),
  token: z.string().length(48),
});

const orderStatuses = [
  "pending",
  "paid",
  "processing",
  "dispatched",
  "completed",
  "cancelled",
] as const;

const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID?.trim() || "148385007";

function hubSpotRecordUrl(objectTypeId: "0-1" | "0-2" | "0-3", recordId?: string | null) {
  if (!recordId) return null;
  const params = new URLSearchParams({
    utm_source: "noxptide_admin",
    utm_medium: "order_sync",
    utm_campaign: "noxptide_ecommerce",
  });
  return `https://app.hubspot.com/contacts/${HUBSPOT_PORTAL_ID}/record/${objectTypeId}/${recordId}?${params}`;
}

function withHubSpotLinks<T extends { hubspotContactId?: string | null; hubspotCompanyId?: string | null; hubspotDealId?: string | null }>(
  order: T,
) {
  return {
    ...order,
    hubspotContactUrl: hubSpotRecordUrl("0-1", order.hubspotContactId),
    hubspotCompanyUrl: hubSpotRecordUrl("0-2", order.hubspotCompanyId),
    hubspotDealUrl: hubSpotRecordUrl("0-3", order.hubspotDealId),
  };
}

async function calculateOrder(input: z.infer<typeof orderInput>) {
  const db = getDb();
  const [variants, statuses] = await Promise.all([
    db.select().from(productVariants),
    db.select().from(productStatuses),
  ]);
  const variantMap = new Map(
    variants.map((variant) => [`${variant.productSlug}:${variant.sizeLabel}`, variant]),
  );
  const statusMap = new Map(statuses.map((status) => [status.productSlug, status.status]));

  const items = input.items.map((item) => {
    const product = getProduct(item.productSlug);
    const size = product?.sizes.find((candidate) => candidate.label === item.sizeLabel);
    if (!product || !size || statusMap.get(item.productSlug) === "hidden") {
      throw new TRPCError({ code: "BAD_REQUEST", message: "A product in your basket is unavailable." });
    }
    const liveVariant = variantMap.get(`${item.productSlug}:${item.sizeLabel}`);
    if (liveVariant && liveVariant.stock < item.qty) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          liveVariant.stock <= 0
            ? `${product.name} ${size.label} is out of stock.`
            : `Only ${liveVariant.stock} × ${product.name} ${size.label} left in stock.`,
      });
    }
    return {
      productSlug: product.slug,
      productName: product.name,
      sizeLabel: size.label,
      unitPricePence: liveVariant?.pricePence ?? Math.round(size.price * 100),
      qty: item.qty,
      category: categories.find((category) => category.slug === product.category)?.name ?? "Research Peptides",
    };
  });
  const subtotalPence = items.reduce((sum, item) => sum + item.unitPricePence * item.qty, 0);
  const discountRate = subtotalPence >= 50_000 ? 0.3 : subtotalPence >= 15_000 ? 0.2 : 0;
  const discountPence = Math.round(subtotalPence * discountRate);
  const shippingPence = input.shippingMethod === "next-day" ? 899 : subtotalPence >= 2_500 ? 0 : 499;
  const totalPence = subtotalPence - discountPence + shippingPence;
  return { items, subtotalPence, discountPence, shippingPence, totalPence };
}

function productImageUrl(origin: string, slug: string, sizeLabel: string) {
  const size = sizeLabel.replace(/\s+/g, "").toLowerCase();
  return `${origin}/images/products/${slug}-${size}.webp`;
}

function toWallidItems(
  origin: string,
  calculated: Awaited<ReturnType<typeof calculateOrder>>,
): WallidItem[] {
  let allocatedDiscount = 0;
  const result = calculated.items.map((item, index) => {
    const lineTotal = item.unitPricePence * item.qty;
    const lineDiscount =
      index === calculated.items.length - 1
        ? calculated.discountPence - allocatedDiscount
        : Math.round((calculated.discountPence * lineTotal) / calculated.subtotalPence);
    allocatedDiscount += lineDiscount;
    return {
      name: `${item.productName} ${item.sizeLabel} × ${item.qty}`,
      category: item.category,
      price_minor: lineTotal - lineDiscount,
      image_url: productImageUrl(origin, item.productSlug, item.sizeLabel),
      product_url: `${origin}/product/${item.productSlug}`,
    };
  });

  if (calculated.shippingPence > 0) {
    const first = calculated.items[0];
    result.push({
      name: "Tracked UK delivery",
      category: "Delivery",
      price_minor: calculated.shippingPence,
      image_url: productImageUrl(origin, first.productSlug, first.sizeLabel),
      product_url: `${origin}/shipping`,
    });
  }
  return result;
}

function publicOrigin(request: Request) {
  if (process.env.PUBLIC_SITE_URL) return process.env.PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") return "https://www.noxptide.co.uk";
  return new URL(request.url).origin;
}

async function syncOrder(order: Order) {
  const db = getDb();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  try {
    const result = await syncOrderToHubSpot(order, items);
    await db
      .update(orders)
      .set(
        result.status === "synced"
          ? {
              hubspotContactId: result.contactId,
              hubspotCompanyId: result.companyId,
              hubspotDealId: result.dealId,
              hubspotSyncedAt: new Date(),
              hubspotSyncError: null,
            }
          : {
              hubspotSyncError: "HUBSPOT_ACCESS_TOKEN is not configured",
            },
      )
      .where(eq(orders.id, order.id));
  } catch (error) {
    const message = error instanceof Error ? error.message : "HubSpot sync failed";
    await db
      .update(orders)
      .set({ hubspotSyncError: message.slice(0, 2000) })
      .where(eq(orders.id, order.id));
    console.error(`[hubspot] order ${order.orderNumber} sync failed:`, error);
  }
}

async function syncOrderOrThrow(order: Order) {
  const db = getDb();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  const result = await syncOrderToHubSpot(order, items);
  await db
    .update(orders)
    .set(
      result.status === "synced"
        ? {
            hubspotContactId: result.contactId,
            hubspotCompanyId: result.companyId,
            hubspotDealId: result.dealId,
            hubspotSyncedAt: new Date(),
            hubspotSyncError: null,
          }
        : {
            hubspotSyncError: "HUBSPOT_ACCESS_TOKEN is not configured",
          },
    )
    .where(eq(orders.id, order.id));
  return result;
}

const stockDeductingStatuses = new Set(["paid", "processing", "dispatched", "completed"]);

async function deductStockForOrder(orderId: number) {
  const db = getDb();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  for (const item of items) {
    await db
      .update(productVariants)
      .set({ stock: sql`GREATEST(${productVariants.stock} - ${item.qty}, 0)` })
      .where(
        and(
          eq(productVariants.productSlug, item.productSlug),
          eq(productVariants.sizeLabel, item.sizeLabel),
        ),
      );
  }
}

export async function applyWallidStatus(event: {
  api_payment_id: string;
  order_id: string;
  status: WallidPaymentStatus;
  amount: number;
  currency: string;
}) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.orderNumber, event.order_id), eq(orders.paymentId, event.api_payment_id)));
  if (!order || event.amount !== order.totalPence || event.currency !== "GBP") return false;

  const shouldDeductStock =
    event.status === "SUCCESS" && !stockDeductingStatuses.has(order.status);
  let status = order.status;
  if (event.status === "SUCCESS") status = "paid";
  if ((event.status === "FAILED" || event.status === "EXPIRED") && order.status === "pending") {
    status = "cancelled";
  }
  await db
    .update(orders)
    .set({ paymentStatus: event.status, status })
    .where(eq(orders.id, order.id));
  if (shouldDeductStock) await deductStockForOrder(order.id);
  await syncOrder({ ...order, paymentStatus: event.status, status });
  return true;
}

export async function processWallidWebhookEvents(events: WallidWebhookEvent[]) {
  let processed = 0;
  for (const event of events) {
    if (await applyWallidStatus(event)) processed += 1;
  }
  return processed;
}

export const ordersRouter = createRouter({
  /** Public: expose only whether checkout can safely start a Wallid payment. */
  checkoutReadiness: publicQuery.query(() => {
    const wallid = checkWallidReadiness();
    return { payByBankReady: wallid.ready };
  }),

  /** Public: create an order and a Wallid hosted Pay-by-Bank session. */
  create: publicQuery.input(orderInput).mutation(async ({ input, ctx }) => {
    if (!checkWallidReadiness().ready) {
      throw new TRPCError({
        code: "SERVICE_UNAVAILABLE",
        message: "Pay by Bank is temporarily unavailable. Please try again shortly.",
      });
    }

    const db = getDb();
    const calculated = await calculateOrder(input);
    const orderNumber = `NOX-${Date.now().toString(36).toUpperCase()}${Math.floor(
      Math.random() * 900 + 100,
    )}`;
    const paymentReturnToken = randomBytes(24).toString("hex");
    const notes = `Organisation: ${input.organisation}\nDelivery: ${input.shippingMethod}`;
    const [result] = await db.insert(orders).values({
      orderNumber,
      customerName: input.customerName,
      email: input.email,
      phone: input.phone,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      postcode: input.postcode,
      country: input.country,
      subtotalPence: calculated.subtotalPence,
      discountPence: calculated.discountPence,
      shippingPence: calculated.shippingPence,
      totalPence: calculated.totalPence,
      paymentReturnToken,
      notes,
    });
    const orderId = result.insertId;
    await db.insert(orderItems).values(
      calculated.items.map((item) => ({
        orderId,
        productSlug: item.productSlug,
        productName: item.productName,
        sizeLabel: item.sizeLabel,
        unitPricePence: item.unitPricePence,
        qty: item.qty,
      })),
    );

    const origin = publicOrigin(ctx.req);
    const successUrl = new URL("/checkout", origin);
    successUrl.searchParams.set("payment", "success");
    successUrl.searchParams.set("order", orderNumber);
    successUrl.searchParams.set("token", paymentReturnToken);
    const failUrl = new URL(successUrl);
    failUrl.searchParams.set("payment", "failed");

    try {
      const payment = await createWallidPayment({
        order_id: orderNumber,
        amount: calculated.totalPence,
        currency: "GBP",
        success_url: successUrl.toString(),
        fail_url: failUrl.toString(),
        customer_email: input.email,
        customer_id: String(orderId),
        description: `Noxptide order ${orderNumber}`,
        metadata: { local_order_id: String(orderId) },
        locale: "en",
        country: "GB",
        items: toWallidItems(origin, calculated),
      });
      if (
        payment.order_id !== orderNumber ||
        payment.amount !== calculated.totalPence ||
        payment.currency !== "GBP" ||
        !payment.api_payment_id ||
        !payment.payment_link
      ) {
        throw new Error("Wallid returned an invalid payment session");
      }
      await db
        .update(orders)
        .set({ paymentId: payment.api_payment_id, paymentStatus: payment.status })
        .where(eq(orders.id, orderId));
      const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
      if (order) await syncOrder(order);
      return { success: true, orderNumber, paymentLink: payment.payment_link };
    } catch (error) {
      await db
        .update(orders)
        .set({ paymentStatus: "FAILED", status: "cancelled" })
        .where(eq(orders.id, orderId));
      console.error(`[wallid] order ${orderNumber} payment session failed:`, error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Pay by Bank is temporarily unavailable. Please try again shortly.",
      });
    }
  }),

  /** Public: read only the payment state for a signed checkout return URL. */
  paymentStatus: publicQuery.input(paymentLookupInput).query(async ({ input }) => {
    const db = getDb();
    const [order] = await db
      .select({ orderNumber: orders.orderNumber, status: orders.status, paymentStatus: orders.paymentStatus })
      .from(orders)
      .where(
        and(
          eq(orders.orderNumber, input.orderNumber),
          eq(orders.paymentReturnToken, input.token),
        ),
      );
    return order ?? null;
  }),

  /** Public: confirm the bank result server-to-server if a webhook is delayed. */
  confirmPayment: publicQuery.input(paymentLookupInput).mutation(async ({ input }) => {
    const db = getDb();
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.orderNumber, input.orderNumber),
          eq(orders.paymentReturnToken, input.token),
        ),
      );
    if (!order?.paymentId) return { status: order?.status ?? null };
    try {
      const payment = await getWallidPaymentStatus(order.paymentId);
      await applyWallidStatus(payment);
      const [updated] = await db.select({ status: orders.status }).from(orders).where(eq(orders.id, order.id));
      return { status: updated?.status ?? null };
    } catch (error) {
      console.error(`[wallid] order ${order.orderNumber} status check failed:`, error);
      return { status: order.status };
    }
  }),

  /** Staff: list all orders, newest first. */
  list: staffQuery.query(async () => {
    const db = getDb();
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(500);
    return rows.map(withHubSpotLinks);
  }),

  /** Staff: single order with its items. */
  get: staffQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [order] = await db.select().from(orders).where(eq(orders.id, input.id));
      if (!order) return null;
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, input.id));
      return { ...withHubSpotLinks(order), items };
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
      const [existing] = await db.select().from(orders).where(eq(orders.id, input.id));
      await db
        .update(orders)
        .set({ status: input.status, ...(input.notes !== undefined ? { notes: input.notes } : {}) })
        .where(eq(orders.id, input.id));
      const [order] = await db.select().from(orders).where(eq(orders.id, input.id));
      if (
        order &&
        existing &&
        stockDeductingStatuses.has(input.status) &&
        !stockDeductingStatuses.has(existing.status)
      ) {
        await deductStockForOrder(order.id);
      }
      if (order) await syncOrder(order);
      return { success: true };
    }),

  /** Staff: manually push an existing order into HubSpot after credentials are added/fixed. */
  syncHubSpot: staffQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [order] = await db.select().from(orders).where(eq(orders.id, input.id));
      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
      }
      return syncOrderOrThrow(order);
    }),

  /** Staff: push a safe batch of unsynced orders to HubSpot after credentials are added/fixed. */
  syncHubSpotPending: staffQuery.mutation(async () => {
    const db = getDb();
    const pending = await db
      .select()
      .from(orders)
      .where(isNull(orders.hubspotSyncedAt))
      .orderBy(desc(orders.createdAt))
      .limit(50);

    let synced = 0;
    let disabled = 0;
    let failed = 0;

    for (const order of pending) {
      try {
        const result = await syncOrderOrThrow(order);
        if (result.status === "synced") synced++;
        else disabled++;
      } catch (error) {
        failed++;
        const message = error instanceof Error ? error.message : "HubSpot sync failed";
        await db
          .update(orders)
          .set({ hubspotSyncError: message.slice(0, 2000) })
          .where(eq(orders.id, order.id));
      }
    }

    return { checked: pending.length, synced, disabled, failed };
  }),
});
