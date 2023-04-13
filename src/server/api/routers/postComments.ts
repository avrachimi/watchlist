import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postCommentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.postComment.findMany({
      include: {
        user: true,
        post: true,
      },
    });
  }),

  getAllByPostId: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.postComment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          user: true,
          post: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }),

  getLatestCommentsbyPostId: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        amount: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.postComment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          user: true,
          post: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.amount,
      });
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.postComment.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: true,
          post: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        userId: z.string(),
        postId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.postComment.create({
        data: {
          content: input.content,
          userId: input.userId,
          postId: input.postId,
        },
        include: {
          user: true,
          post: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.postComment.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
