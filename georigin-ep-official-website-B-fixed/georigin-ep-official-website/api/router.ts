import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { insertSubscription } from "./queries/subscriptions";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(320);

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  subscribe: publicQuery
    .input(
      z.object({
        email: emailSchema,
        source: z.string().trim().max(64).optional().default("website"),
      })
    )
    .mutation(async ({ input }) => {
      return insertSubscription(input.email, input.source);
    }),
});

export type AppRouter = typeof appRouter;
