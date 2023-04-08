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
        Watched: {
          include: {
            user: true,
          },
        },
        Rating: true,
      },
    });
  }),
  getById: protectedProcedure
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
          Watched: {
            include: {
              user: true,
            },
          },
          Rating: true,
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
