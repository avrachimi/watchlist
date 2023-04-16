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

  getWatchedMovieIdsbyUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.watched.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          movie: {
            select: {
              id: true,
            },
          },
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
    .mutation(async ({ ctx, input }) => {
      // Find and delete watchlist entry when user watches a movie
      const watchlist = await ctx.prisma.watchlist.findFirst({
        where: {
          userId: input.userId,
          movieId: input.movieId,
        },
      });

      if (watchlist)
        await ctx.prisma.watchlist.delete({
          where: {
            id: watchlist.id,
          },
        });

      return ctx.prisma.watched.create({
        data: {
          movieId: input.movieId,
          userId: input.userId,
        },
      });
    }),
});
