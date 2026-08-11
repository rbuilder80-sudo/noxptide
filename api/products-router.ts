import { z } from "zod";
import { and, asc, eq } from "drizzle-orm";
import { productStatuses, productVariants } from "@db/schema";
import { products as storefrontProducts } from "@/data/products";
import { getDb } from "./queries/connection";
import { createRouter, publicQuery, editorQuery } from "./middleware";
import { syncProductCatalogToHubSpot, type EcommerceOrderItem } from "./lib/hubspot";

/**
 * Catalogue control: stock & pricing overrides, managed from the admin panel.
 * The storefront keeps its static product data; rows here override price and
 * control stock/visibility live, without a redeploy. Orders themselves are
 * handled in HubSpot — this router is purely catalogue state.
 */
export const productsRouter = createRouter({
  /** Public: every price/stock override + product visibility (small tables). */
  overrides: publicQuery.query(async () => {
    const db = getDb();
    const [variants, statuses] = await Promise.all([
      db
        .select({
          productSlug: productVariants.productSlug,
          sizeLabel: productVariants.sizeLabel,
          pricePence: productVariants.pricePence,
          stock: productVariants.stock,
        })
        .from(productVariants)
        .orderBy(asc(productVariants.productSlug)),
      db
        .select({
          productSlug: productStatuses.productSlug,
          status: productStatuses.status,
        })
        .from(productStatuses),
    ]);
    return { variants, statuses };
  }),

  /** Editor+: full variant rows with audit info, for the admin table. */
  variants: editorQuery.query(async () => {
    const db = getDb();
    return db.select().from(productVariants).orderBy(asc(productVariants.productSlug));
  }),

  /** Editor+: create or update the price/stock for one product size. */
  upsertVariant: editorQuery
    .input(
      z.object({
        productSlug: z.string().min(1).max(128),
        sizeLabel: z.string().min(1).max(32),
        pricePence: z.number().int().min(0).max(10_000_000),
        stock: z.number().int().min(0).max(1_000_000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const by = ctx.user.name ?? ctx.user.email ?? "admin";
      await db
        .insert(productVariants)
        .values({
          productSlug: input.productSlug,
          sizeLabel: input.sizeLabel,
          pricePence: input.pricePence,
          stock: input.stock,
          updatedBy: by,
        })
        .onDuplicateKeyUpdate({
          set: {
            pricePence: input.pricePence,
            stock: input.stock,
            updatedBy: by,
          },
        });
      return { success: true };
    }),

  /** Editor+: delete an override, reverting the size to catalogue defaults. */
  removeVariant: editorQuery
    .input(z.object({ productSlug: z.string().max(128), sizeLabel: z.string().max(32) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(productVariants)
        .where(
          and(
            eq(productVariants.productSlug, input.productSlug),
            eq(productVariants.sizeLabel, input.sizeLabel),
          ),
        );
      return { success: true };
    }),

  /** Editor+: show or hide a whole product on the storefront. */
  setStatus: editorQuery
    .input(
      z.object({
        productSlug: z.string().min(1).max(128),
        status: z.enum(["active", "hidden"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const by = ctx.user.name ?? ctx.user.email ?? "admin";
      await db
        .insert(productStatuses)
        .values({ productSlug: input.productSlug, status: input.status, updatedBy: by })
        .onDuplicateKeyUpdate({ set: { status: input.status, updatedBy: by } });
      return { success: true };
    }),

  /** Editor+: push the active storefront catalogue into HubSpot Products. */
  syncHubSpotCatalog: editorQuery.mutation(async () => {
    const db = getDb();
    const [variants, statuses] = await Promise.all([
      db.select().from(productVariants),
      db.select().from(productStatuses),
    ]);
    const variantPrice = new Map(
      variants.map((variant) => [`${variant.productSlug}:${variant.sizeLabel}`, variant.pricePence]),
    );
    const status = new Map(statuses.map((row) => [row.productSlug, row.status]));
    const hidden = storefrontProducts.filter((product) => status.get(product.slug) === "hidden").length;
    const items: EcommerceOrderItem[] = storefrontProducts
      .filter((product) => status.get(product.slug) !== "hidden")
      .flatMap((product) =>
        product.sizes.map((size) => ({
          productSlug: product.slug,
          productName: product.name,
          sizeLabel: size.label,
          unitPricePence:
            variantPrice.get(`${product.slug}:${size.label}`) ?? Math.round(size.price * 100),
          qty: 1,
        })),
      );

    const result = await syncProductCatalogToHubSpot(items);
    return {
      ...result,
      checked: items.length,
      skippedHiddenProducts: hidden,
    };
  }),
});
