import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postLikeRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.postLike.findMany({
      include: {
        user: true,
        post: true,
      },
      orderBy: {
        createdAt: "desc",
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
      return ctx.prisma.postLike.findMany({
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
      });
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.postLike.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: true,
          post: true,
        },
      });
    }),

  getByPostIdAndUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        postId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.postLike.findFirst({
        where: {
          userId: input.userId,
          postId: input.postId,
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
        userId: z.string(),
        postId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.postLike.create({
        data: {
          userId: input.userId,
          postId: input.postId,
          isLiked: true,
        },
        include: {
          user: true,
          post: true,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        postId: z.string(),
        isLiked: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.postLike.update({
        where: {
          id: input.id,
        },
        data: {
          userId: input.userId,
          postId: input.postId,
          isLiked: input.isLiked,
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
      return ctx.prisma.postLike.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
