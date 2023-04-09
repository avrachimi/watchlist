import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const watchedRouter = createTRPCRouter({
  getWatchedUsersByMovieId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.watched.findMany({
        where: {
          movieId: input.id,
        },
        include: {
          user: true,
        },
      });
    }),

  markWatched: protectedProcedure
    .input(
      z.object({
        movieId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.watched.create({
        data: {
          movieId: input.movieId,
          userId: input.userId,
        },
      });
    }),
});
