import { z } from "zod";
import { and, desc, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { discounts, type Discount } from "@db/schema";
import { getDb } from "./queries/connection";
import { adminQuery, createRouter, publicQuery, staffQuery } from "./middleware";

const codeSchema = z
  .string()
  .min(2)
  .max(32)
  .regex(/^[A-Za-z0-9-]+$/, "Code may only contain letters, numbers and dashes")
  .transform((code) => code.toUpperCase());

const discountBase = z.object({
  code: codeSchema,
  description: z.string().max(255).optional(),
  type: z.enum(["percent", "fixed"]),
  value: z.number().int().positive(),
  minSubtotalPence: z.number().int().min(0).default(0),
  maxUses: z.number().int().positive().nullable().optional(),
  startsAt: z.coerce.date().nullable().optional(),
  expiresAt: z.coerce.date().nullable().optional(),
  active: z.boolean().default(true),
});

const discountInput = discountBase.superRefine((value, ctx) => {
    if (value.type === "percent" && (value.value < 1 || value.value > 90)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Percent discounts must be 1-90." });
    }
    if (value.type === "fixed" && value.value <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Fixed discounts must be greater than 0." });
    }
    if (value.startsAt && value.expiresAt && value.expiresAt <= value.startsAt) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Expiry must be after the start date." });
    }
  });

type DiscountCheck =
  | { valid: true; discount: Discount }
  | { valid: false; reason: "invalid" | "expired" | "exhausted" | "minimum not met" };

/**
 * Shared validation used by the public validate endpoint and by checkout.
 * Reasons are generic so the public endpoint never leaks discount details.
 */
export function checkDiscount(
  discount: Discount | undefined,
  subtotalPence: number,
  now = new Date(),
): DiscountCheck {
  if (!discount || !discount.active) return { valid: false, reason: "invalid" };
  if ((discount.startsAt && now < discount.startsAt) || (discount.expiresAt && now > discount.expiresAt)) {
    return { valid: false, reason: "expired" };
  }
  if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
    return { valid: false, reason: "exhausted" };
  }
  if (subtotalPence < discount.minSubtotalPence) {
    return { valid: false, reason: "minimum not met" };
  }
  return { valid: true, discount };
}

export function discountAmountPence(discount: Discount, subtotalPence: number) {
  const amount =
    discount.type === "percent"
      ? Math.round((subtotalPence * discount.value) / 100)
      : discount.value;
  return Math.max(0, Math.min(amount, subtotalPence));
}

/**
 * Atomically redeem a discount: increments usedCount only while the code is
 * active, within its usage cap and (if bounded) usage window. Returns true if
 * the redemption was applied.
 */
export async function redeemDiscount(db: ReturnType<typeof getDb>, code: string) {
  const now = new Date();
  const result = await db
    .update(discounts)
    .set({ usedCount: sql`${discounts.usedCount} + 1` })
    .where(
      and(
        eq(discounts.code, code.toUpperCase()),
        eq(discounts.active, true),
        sql`(${discounts.maxUses} IS NULL OR ${discounts.usedCount} < ${discounts.maxUses})`,
        sql`(${discounts.startsAt} IS NULL OR ${discounts.startsAt} <= ${now})`,
        sql`(${discounts.expiresAt} IS NULL OR ${discounts.expiresAt} >= ${now})`,
      ),
    );
  return (result[0]?.affectedRows ?? 0) > 0;
}

export const discountsRouter = createRouter({
  /** Admin: list all discounts, newest first. */
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(discounts).orderBy(desc(discounts.createdAt));
  }),

  /** Admin: create a discount code. */
  create: adminQuery.input(discountInput).mutation(async ({ input, ctx }) => {
    const db = getDb();
    const [existing] = await db.select().from(discounts).where(eq(discounts.code, input.code));
    if (existing) {
      throw new TRPCError({ code: "CONFLICT", message: "A discount with this code already exists." });
    }
    await db.insert(discounts).values({
      code: input.code,
      description: input.description,
      type: input.type,
      value: input.value,
      minSubtotalPence: input.minSubtotalPence,
      maxUses: input.maxUses ?? null,
      startsAt: input.startsAt ?? null,
      expiresAt: input.expiresAt ?? null,
      active: input.active,
      createdBy: ctx.user.email ?? ctx.user.name ?? undefined,
    });
    return { success: true };
  }),

  /** Admin: update an existing discount (code cannot be changed). */
  update: adminQuery
    .input(
      z.object({
        id: z.number().int().positive(),
        patch: discountBase.omit({ code: true }).partial(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [existing] = await db.select().from(discounts).where(eq(discounts.id, input.id));
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Discount not found." });
      }
      const merged = { ...existing, ...input.patch };
      if (merged.startsAt && merged.expiresAt && merged.expiresAt <= merged.startsAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Expiry must be after the start date." });
      }
      await db.update(discounts).set(input.patch).where(eq(discounts.id, input.id));
      return { success: true };
    }),

  /** Admin: remove a discount code. */
  remove: adminQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(discounts).where(eq(discounts.id, input.id));
      return { success: true };
    }),

  /** Admin: enable/disable a discount without deleting it. */
  toggleActive: adminQuery
    .input(z.object({ id: z.number().int().positive(), active: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(discounts).set({ active: input.active }).where(eq(discounts.id, input.id));
      return { success: true };
    }),

  /** Staff: aggregate usage stats. */
  stats: staffQuery.query(async () => {
    const db = getDb();
    const rows = await db.select().from(discounts);
    return {
      total: rows.length,
      active: rows.filter((row) => row.active).length,
      totalRedemptions: rows.reduce((sum, row) => sum + row.usedCount, 0),
    };
  }),

  /** Public: validate a code against a basket subtotal (generic reasons only). */
  validate: publicQuery
    .input(z.object({ code: z.string().min(2).max(32), subtotalPence: z.number().int().min(0) }))
    .query(async ({ input }) => {
      const db = getDb();
      const [discount] = await db
        .select()
        .from(discounts)
        .where(eq(discounts.code, input.code.toUpperCase()));
      const check = checkDiscount(discount, input.subtotalPence);
      if (!check.valid) {
        return { valid: false as const, discountPence: 0, reason: check.reason };
      }
      return {
        valid: true as const,
        discountPence: discountAmountPence(check.discount, input.subtotalPence),
      };
    }),
});
