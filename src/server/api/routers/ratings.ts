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
    .mutation(({ ctx, input }) => {
      return ctx.prisma.rating.create({
        data: {
          rating: input.rating,
          review: input.review,
          userId: input.userId,
          movieId: input.movieId,
        },
      });
    }),
});
