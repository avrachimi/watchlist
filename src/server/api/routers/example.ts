import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import externalApi from "~/server/services/externalApi";

interface Movie {
  id: number;
  name: string;
  overview: string;
  vote_average?: number;
  backdrop_path: string;
}

export const exampleRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  getMovies: publicProcedure.query(async ({ ctx }) => {
    const params = {
      api_key: process.env.TMDB_KEY,
      query: "Greys",
      /* region: "USA840", */
    };
    const { data } = await externalApi.get("/search/multi", { params: params });
    const movies: Movie[] = data.results;
    movies.map(
      (movie: Movie) =>
        (movie.backdrop_path = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`)
    );
    return movies;
  }),
});
