import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const movieRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.movie.findMany({
      include: {
        watchedBy: true,
      },
    });
  }),
  getById: publicProcedure // TODO: Change to private later
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.movie.findUnique({
        where: {
          id: input.id,
        },
        include: {
          watchedBy: true,
        },
      });
    }),
});
