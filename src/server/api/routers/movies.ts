import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import externalApi, { DetailedMovie } from "~/server/services/externalApi";

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
      orderBy: [
        {
          friendRating: "desc",
        },
        {
          Watched: {
            _count: "desc",
          },
        },
        {
          imdbRating: "desc",
        },
      ],
    });
  }),

  getAllMovies: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.movie.findMany({
      where: {
        type: "movie",
      },
      include: {
        Watched: {
          include: {
            user: true,
          },
        },
        Rating: true,
      },
      orderBy: [
        {
          friendRating: "desc",
        },
        {
          Watched: {
            _count: "desc",
          },
        },
        {
          imdbRating: "desc",
        },
      ],
    });
  }),

  getAllSeries: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.movie.findMany({
      where: {
        type: "series",
      },
      include: {
        Watched: {
          include: {
            user: true,
          },
        },
        Rating: true,
      },
      orderBy: [
        {
          friendRating: "desc",
        },
        {
          Watched: {
            _count: "desc",
          },
        },
        {
          imdbRating: "desc",
        },
      ],
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

  getByImdbId: protectedProcedure
    .input(
      z.object({
        imdbId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.movie.findFirst({
        where: {
          imdbId: input.imdbId,
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
        Released: z.string(),
        Runtime: z.string(),
        Genre: z.string(),
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
      if (input.imdbRating) imdbRating = parseFloat(input.imdbRating) / 2;

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
          genre: input.Genre,
          released: new Date(input.Released),
          runtime: parseInt(input.Runtime.split(" ")[0] ?? "0"),
        },
      });
    }),

  updateRatings: protectedProcedure
    .input(
      z.object({
        movieId: z.string(),
        imdbId: z.string(),
        reviews: z.array(
          z.object({
            rating: z.number(),
          })
        ),
        currRating: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let sum = 0;
      input.reviews.map((review) => {
        sum += review.rating;
      });
      const avg =
        Math.sign(input.currRating) >= 0
          ? (sum + input.currRating) / (input.reviews.length + 1)
          : (sum + input.currRating) / (input.reviews.length - 1);
      console.log(avg);

      const { data } = await externalApi.get(
        `/?apiKey=${process.env.OMDB_KEY}&i=${input.imdbId}`
      );
      const movie: DetailedMovie = data;

      let imdbRating = 0;
      let rottenRating = 0;
      let metaRating = 0;

      movie.Ratings.map((rating) => {
        if (rating.Source === "Rotten Tomatoes")
          rottenRating = parseFloat(rating.Value.split("%")[0] ?? "0") / 20;
        if (rating.Source === "Metacritic")
          metaRating = parseFloat(rating.Value.split("/")[0] ?? "0") / 20;
      });
      if (movie.imdbRating) imdbRating = parseFloat(movie.imdbRating) / 2;

      return ctx.prisma.movie.update({
        where: {
          id: input.movieId,
        },
        data: {
          friendRating: avg,
          rottenRating: rottenRating,
          metacriticRating: metaRating,
          imdbRating: imdbRating,
        },
      });
    }),

  updateFields: protectedProcedure
    .input(
      z.object({
        movieId: z.string(),
        imdbId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data } = await externalApi.get(
        `/?apiKey=${process.env.OMDB_KEY}&i=${input.imdbId}`
      );
      const movie: DetailedMovie = data;

      const runtime =
        typeof parseInt(movie.Runtime.split(" ")[0]?.toString() ?? "0") !==
        "undefined"
          ? parseInt(movie.Runtime.split(" ")[0]?.toString() ?? "0")
          : 0;

      return ctx.prisma.movie.update({
        where: {
          id: input.movieId,
        },
        data: {
          genre: movie.Genre,
          released: new Date(movie.Released),
          runtime: runtime ? runtime : 0,
        },
      });
    }),
});
