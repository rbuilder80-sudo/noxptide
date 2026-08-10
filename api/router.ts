import { authRouter } from "./auth-router";
import { ordersRouter } from "./orders-router";
import { usersRouter } from "./users-router";
import { cmsRouter } from "./cms-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  orders: ordersRouter,
  users: usersRouter,
  cms: cmsRouter,
});

export type AppRouter = typeof appRouter;
