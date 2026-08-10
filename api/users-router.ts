import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { users } from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, adminQuery } from "./middleware";

/** Admin-only: team & access management. The main admin sets each user's level. */
export const usersRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        role: users.role,
        lastSignInAt: users.lastSignInAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(500);
  }),

  setRole: adminQuery
    .input(
      z.object({
        id: z.number().int().positive(),
        role: z.enum(["user", "support", "manager", "admin"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.id === ctx.user.id && input.role !== "admin") {
        throw new Error("You cannot remove your own admin access.");
      }
      const db = getDb();
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.id));
      return { success: true };
    }),
});
