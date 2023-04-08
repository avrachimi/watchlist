import Head from "next/head";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { LoadingPage } from "~/components/loading";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { Movie } from "@prisma/client";
import { useRouter } from "next/router";
import ReviewStars from "~/components/ReviewStars";

const SingleMovie = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  let { id } = router.query;

  if (typeof id !== "string" || !id) id = "";

  const { data: movie, isLoading: moviesLoading } = api.movie.getById.useQuery({
    id: id,
  });

  if (moviesLoading) return <LoadingPage />;

  if (!movie) return <div>Couldn't load movie. Try again.</div>;

  if (!sessionData?.user) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900">
        <button
          className="rounded-xl bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => void signIn()}
        >
          Sign in
        </button>
      </div>
    );
  }

  const getAvgRating = (ratings: typeof movie.Rating) => {
    let sum = 0;
    for (let rating of ratings) {
      sum += rating.rating;
    }

    return sum / ratings.length;
  };

  const Review = ({ movieId }: { movieId: string }) => {
    const { data: ratings } = api.rating.getByMovieId.useQuery({
      movieId: movieId,
    });

    if (!ratings) return <div>No ratings found</div>;

    const reviewComponents = [];

    for (let rating of ratings) {
      reviewComponents.push(
        <div key={rating.id} className="my-5 rounded-md border p-3">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="text-md">{rating.user.name}</div>
            <div>
              <ReviewStars rating={rating.rating} />
            </div>
          </div>
          <div className="m-2 mt-4 text-sm">{rating.review}</div>
          <div className="mx-2 text-sm text-gray-400">
            {rating.createdAt.toDateString()}
          </div>
        </div>
      );
    }

    return (
      <div className="w-[90%]">
        <div className="mb-5 text-lg underline">Reviews</div>
        {reviewComponents}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Watchlist</title>
        <meta name="description" content="Movie and tv show recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-full bg-gray-900">
        <Navbar />
        <div className="flex flex-col items-center justify-center">
          <div className="my-2 text-3xl">{movie.title}</div>
          <img
            src={movie.imageUrl}
            className="my-3 w-[65%] border object-contain"
          />
          <ReviewStars rating={getAvgRating(movie.Rating)} />
          <div className="mt-5 flex w-full items-center justify-around text-center">
            {movie.imdbRating > 0 && (
              <div>
                <span className="text-sm">IMDB</span>
                <ReviewStars rating={movie.imdbRating} />
              </div>
            )}
            {movie.rottenRating > 0 && (
              <div>
                <span className="text-sm">Rotten</span>
                <ReviewStars rating={movie.rottenRating} />
              </div>
            )}
            {movie.metacriticRating > 0 && (
              <div>
                <span className="text-sm">Metacritic</span>
                <ReviewStars rating={movie.metacriticRating} />
              </div>
            )}
          </div>
          <div className="text-md my-10 px-4 text-center">{movie.plot}</div>
          <div className="my-2 flex w-full flex-col items-center justify-center text-center">
            <span className="text-lg underline">Watched By</span>
            <span>
              {movie.watchedBy.map((user) => (
                <div className="text-sm">{user.name}</div>
              ))}
            </span>
          </div>
          <div className="mt-8 flex w-full flex-col items-center justify-center">
            <Review movieId={movie.id} />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="my-5 rounded-lg border-2 border-slate-400 py-2 px-3 hover:bg-slate-700"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      </main>
    </>
  );
};

export default SingleMovie;
