import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const watchlistRouter = createTRPCRouter({
  getWatchlistMoviesByUserId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.watchlist.findMany({
        where: {
          userId: input.id,
        },
        include: {
          user: true,
          movie: true,
        },
      });
    }),

  getWatchlistMovie: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        movieId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.watchlist.findFirst({
        where: {
          userId: input.userId,
          movieId: input.movieId,
        },
        include: {
          user: true,
          movie: true,
        },
      });
    }),

  add: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        movieId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.watchlist.create({
        data: {
          movieId: input.movieId,
          userId: input.userId,
        },
      });
    }),
});
