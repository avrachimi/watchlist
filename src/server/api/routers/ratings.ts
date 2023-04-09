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
          rating: "desc",
        },
      });
    }),

  getByMovieAndUserId: protectedProcedure
    .input(
      z.object({
        movieId: z.string(),
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.rating.findFirst({
        where: {
          movieId: input.movieId,
          userId: input.userId,
        },
        include: {
          user: true,
        },
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
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.rating.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
