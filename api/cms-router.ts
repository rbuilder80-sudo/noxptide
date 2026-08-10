import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { pageContents } from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, publicQuery, editorQuery } from "./middleware";

/** CMS: per-page SEO meta + content overrides, editable from the admin panel. */
export const cmsRouter = createRouter({
  /** Public: fetch one page's overrides (used by the storefront SEO hook). */
  get: publicQuery
    .input(z.object({ pageKey: z.string().max(191) }))
    .query(async ({ input }) => {
      const db = getDb();
      const [row] = await db
        .select()
        .from(pageContents)
        .where(eq(pageContents.pageKey, input.pageKey));
      return row ?? null;
    }),

  /** Public: fetch all overrides (small table; lets pages hydrate in one call). */
  all: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(pageContents).orderBy(asc(pageContents.pageKey));
  }),

  /** Editor+ (admin/manager): create or update a page's SEO/content. */
  upsert: editorQuery
    .input(
      z.object({
        pageKey: z.string().min(1).max(191),
        metaTitle: z.string().max(255).optional().nullable(),
        metaDescription: z.string().max(500).optional().nullable(),
        content: z.string().max(100_000).optional().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      await db
        .insert(pageContents)
        .values({
          pageKey: input.pageKey,
          metaTitle: input.metaTitle ?? null,
          metaDescription: input.metaDescription ?? null,
          content: input.content ?? null,
          updatedBy: ctx.user.name ?? ctx.user.email ?? "admin",
        })
        .onDuplicateKeyUpdate({
          set: {
            metaTitle: input.metaTitle ?? null,
            metaDescription: input.metaDescription ?? null,
            content: input.content ?? null,
            updatedBy: ctx.user.name ?? ctx.user.email ?? "admin",
          },
        });
      return { success: true };
    }),

  delete: editorQuery
    .input(z.object({ pageKey: z.string().max(191) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(pageContents).where(eq(pageContents.pageKey, input.pageKey));
      return { success: true };
    }),
});
