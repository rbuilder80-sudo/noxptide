import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "support", "manager", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Noxptide e-commerce backend ─────────────────────────────────────────────

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("orderNumber", { length: 32 }).notNull().unique(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  addressLine1: varchar("addressLine1", { length: 255 }).notNull(),
  addressLine2: varchar("addressLine2", { length: 255 }),
  city: varchar("city", { length: 128 }).notNull(),
  postcode: varchar("postcode", { length: 16 }).notNull(),
  country: varchar("country", { length: 64 }).default("United Kingdom").notNull(),
  subtotalPence: int("subtotalPence").notNull(),
  discountPence: int("discountPence").default(0).notNull(),
  shippingPence: int("shippingPence").default(0).notNull(),
  totalPence: int("totalPence").notNull(),
  paymentProvider: varchar("paymentProvider", { length: 32 }).default("wallid").notNull(),
  paymentId: varchar("paymentId", { length: 64 }).unique(),
  paymentStatus: varchar("paymentStatus", { length: 32 }).default("NEW").notNull(),
  paymentReturnToken: varchar("paymentReturnToken", { length: 64 }).unique(),
  status: mysqlEnum("status", [
    "pending",
    "paid",
    "processing",
    "dispatched",
    "completed",
    "cancelled",
  ])
    .default("pending")
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
export type Order = typeof orders.$inferSelect;

export const orderItems = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull(),
  productSlug: varchar("productSlug", { length: 128 }).notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  sizeLabel: varchar("sizeLabel", { length: 32 }).notNull(),
  unitPricePence: int("unitPricePence").notNull(),
  qty: int("qty").notNull(),
});
export type OrderItem = typeof orderItems.$inferSelect;

// CMS: per-page SEO meta + editable content blocks, managed from the admin panel.
export const pageContents = mysqlTable("page_contents", {
  id: serial("id").primaryKey(),
  pageKey: varchar("pageKey", { length: 191 }).notNull().unique(), // e.g. "home", "shop", "product:bpc-157", "guide:bpc-157"
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  content: text("content"), // JSON blob of editable fields per page
  updatedBy: varchar("updatedBy", { length: 255 }),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
export type PageContent = typeof pageContents.$inferSelect;
