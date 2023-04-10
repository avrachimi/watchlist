import { createTRPCRouter } from "~/server/api/trpc";
import { externalRouter } from "./routers/external";
import { movieRouter } from "./routers/movies";
import { ratingRouter } from "./routers/ratings";
import { userRouter } from "./routers/users";
import { watchedRouter } from "./routers/watched";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  movie: movieRouter,
  rating: ratingRouter,
  watched: watchedRouter,
  external: externalRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
