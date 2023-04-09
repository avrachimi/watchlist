import { string, z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import externalApi, {
  Movie,
  DetailedMovie,
} from "~/server/services/externalApi";

export const externalRouter = createTRPCRouter({
  getSearch: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { data } = await externalApi.get(
        `/?apiKey=${process.env.OMDB_KEY}&s=${input.query}`
      );
      const movies: Movie[] = data.Search;
      return movies;
    }),

  getDetailedMovie: protectedProcedure
    .input(
      z.object({
        imdbId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { data } = await externalApi.get(
        `/?apiKey=${process.env.OMDB_KEY}&i=${input.imdbId}`
      );
      const movie: DetailedMovie = data;
      return movie;
    }),
});
