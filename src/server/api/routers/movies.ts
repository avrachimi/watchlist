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

  create: protectedProcedure
    .input(
      z.object({
        imdbID: z.string(),
        Title: z.string(),
        Plot: z.string(),
        Ratings: z.array(
          z.object({
            Source: z.string(),
            Value: z.string(),
          })
        ),
        imdbRating: z.string(),
        Poster: z.string(),
        Type: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      let imdbRating = 0;
      let rottenRating = 0;
      let metaRating = 0;

      input.Ratings.map((rating) => {
        if (rating.Source === "Rotten Tomatoes")
          rottenRating = parseFloat(rating.Value.split("%")[0] ?? "0") / 20;
        if (rating.Source === "Metacritic")
          metaRating = parseFloat(rating.Value.split("/")[0] ?? "0") / 20;
      });
      if (input.imdbRating) imdbRating = imdbRating / 2;

      return ctx.prisma.movie.create({
        data: {
          imdbId: input.imdbID,
          title: input.Title,
          plot: input.Plot,
          rottenRating: rottenRating,
          metacriticRating: metaRating,
          imdbRating: imdbRating,
          imageUrl: input.Poster,
          type: input.Type,
        },
      });
    }),
});
