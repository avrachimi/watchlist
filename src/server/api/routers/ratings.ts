import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const ratingRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.rating.findMany({
      include: {
        user: true,
      },
    });
  }),

  getByMovieId: protectedProcedure
    .input(
      z.object({
        movieId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.rating.findMany({
        where: {
          movieId: input.movieId,
        },
        include: {
          user: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  getMoviesByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.rating.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          user: true,
          movie: true,
        },
        orderBy: [
          {
            rating: "desc",
          },
          {
            movie: {
              title: "asc",
            },
          },
        ],
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        rating: z.number(),
        review: z.string(),
        userId: z.string(),
        movieId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createdRating = await ctx.prisma.rating.create({
        data: {
          rating: input.rating,
          review: input.review,
          userId: input.userId,
          movieId: input.movieId,
        },
        include: {
          user: true,
        },
      });
      return createdRating;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        movieId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.rating.delete({
        where: {
          userId_movieId: {
            userId: input.userId,
            movieId: input.movieId,
          },
        },
      });
    }),
});
