import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import externalApi, { DetailedMovie } from "~/server/services/externalApi";

export const userRouter = createTRPCRouter({
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
          Rating: true,
        },
      });
    }),
});
