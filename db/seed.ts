import { productVariants } from "./schema";
import { getDb } from "../api/queries/connection";
import { products } from "../src/data/products";

/**
 * Seeds one stock/pricing row per product size from the static catalogue,
 * so the admin panel opens with the full current inventory editable.
 * Safe to re-run: existing rows (with admin edits) are left untouched.
 */
async function seed() {
  const db = getDb();
  console.log("Seeding product variants...");

  const DEFAULT_STOCK = 100;
  let count = 0;
  for (const p of products) {
    for (const s of p.sizes) {
      await db
        .insert(productVariants)
        .values({
          productSlug: p.slug,
          sizeLabel: s.label,
          pricePence: Math.round(s.price * 100),
          stock: DEFAULT_STOCK,
          updatedBy: "seed",
        })
        .onDuplicateKeyUpdate({ set: { productSlug: p.slug } }); // no-op: keep admin edits
      count++;
    }
  }

  console.log(`Done — ${count} variants seeded (existing edits preserved).`);
  process.exit(0); // close MySQL connection pool
}

seed();
