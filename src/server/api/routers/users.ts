import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      include: {
        Watched: {
          include: {
            movie: {
              select: {
                id: true,
                type: true,
              },
            },
          },
        },
        Rating: {
          orderBy: {
            rating: "desc",
          },
        },
      },
      orderBy: {
        Watched: {
          _count: "desc",
        },
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
      return ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          Watched: {
            include: {
              user: true,
              movie: true,
            },
          },
          Rating: {
            orderBy: {
              rating: "desc",
            },
          },
        },
      });
    }),
});
