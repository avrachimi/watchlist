import Head from "next/head";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { LoadingPage } from "~/components/loading";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { Movie } from "@prisma/client";
import { useRouter } from "next/router";
import ReviewStars from "~/components/ReviewStars";
import { NextResponse } from "next/server";
import { useState } from "react";

const SingleMovie = () => {
  const [watchedBy, setWatchedBy] = useState([""]);
  const { data: sessionData } = useSession();
  const router = useRouter();
  let { id } = router.query;
  const { mutate, error } = api.movie.markWatched.useMutation();

  if (typeof id !== "string" || !id) id = "";

  const { data: movie, isLoading: moviesLoading } = api.movie.getById.useQuery({
    id: id,
  });

  if (moviesLoading) return <LoadingPage />;

  if (!movie) return <div>Couldn't load movie. Try again.</div>;

  if (!sessionData?.user) {
    return NextResponse.redirect("https://watch.avrachimi.com");
  }

  const getAvgRating = (ratings: typeof movie.Rating) => {
    let sum = 0;
    for (let rating of ratings) {
      sum += rating.rating;
    }

    return sum / ratings.length;
  };

  const markWatched = () => {
    mutate({ movieId: movie.id, userId: sessionData.user.id });
    setWatchedBy((prevVal) => [...prevVal, sessionData.user.name]);
  };

  const WriteReview = ({
    movieId,
    userId,
  }: {
    movieId: string;
    userId: string;
  }) => {
    const { mutate, error } = api.rating.create.useMutation();
    return (
      <div className="rounded-lg border">
        <div className="p-2 text-center">Write a review</div>
        <form
          className="flex flex-col items-center justify-center gap-2 p-2"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const ratingValue = formData.get("rating");
            const reviewValue = formData.get("review");

            console.log(ratingValue);

            mutate({
              rating: ratingValue ? parseFloat(ratingValue.toString()) : 0,
              review: reviewValue ? reviewValue.toString() : "",
              movieId: movieId,
              userId: userId,
            });
          }}
        >
          <input
            className="w-full rounded-md text-black"
            id="rating"
            name="rating"
            type="number"
            min={0}
            max={5}
            defaultValue={0}
            step={0.25}
            required
          />
          <textarea
            className="w-full rounded-md text-black"
            id="review"
            name="review"
          />
          {error?.data?.zodError?.fieldErrors.rating && (
            <span className="mb-8 text-red-500">
              {error.data.zodError.fieldErrors.rating}
            </span>
          )}
          {error?.data?.zodError?.fieldErrors.review && (
            <span className="mb-8 text-red-500">
              {error.data.zodError.fieldErrors.review}
            </span>
          )}
          <button
            className="m-2 w-fit rounded-lg border bg-gray-600 px-2 py-1"
            type="submit"
          >
            Post Review
          </button>
        </form>
      </div>
    );
  };

  const Reviews = ({ movieId }: { movieId: string }) => {
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
            {rating.createdAt.toLocaleString()}
          </div>
        </div>
      );
    }

    return (
      <div className="w-[90%]">
        <div className="mb-5 border-b text-lg">Reviews</div>
        <WriteReview movieId={movie.id} userId={sessionData.user.id} />
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
      <main className="min-h-auto bg-gray-900">
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
              <div className="rounded-md border py-1 px-2">
                <div className="mb-2 border-b pb-1 text-sm">IMDB</div>
                <ReviewStars rating={movie.imdbRating} />
                <span className="text-xs">{movie.imdbRating} / 5</span>
              </div>
            )}
            {movie.rottenRating > 0 && (
              <div className="rounded-md border py-1 px-2">
                <div className="mb-2 border-b pb-1 text-sm">Rotten</div>
                <ReviewStars rating={movie.rottenRating} />
                <span className="text-xs">{movie.rottenRating} / 5</span>
              </div>
            )}
            {movie.metacriticRating > 0 && (
              <div className="rounded-md border py-1 px-2">
                <div className="mb-2 border-b pb-1 text-sm">Metacritic</div>
                <ReviewStars rating={movie.metacriticRating} />
                <span className="text-xs">{movie.metacriticRating} / 5</span>
              </div>
            )}
          </div>
          <div className="text-md my-10 px-4 text-center">{movie.plot}</div>
          <div className="my-2 flex w-full flex-col items-center justify-center text-center">
            <span className="text-lg underline">Watched By</span>
            <span>
              {movie.Watched.map((watched) => (
                <div className="text-sm">{watched.user.name}</div>
              ))}
            </span>
            <button
              className="mt-10 rounded-md border-2 bg-green-800 p-2 text-gray-200"
              onClick={markWatched}
            >
              Mark as watched
            </button>
          </div>
          <div className="mt-8 flex w-full flex-col items-center justify-center">
            <Reviews movieId={movie.id} />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="mt-5 rounded-lg border-2 border-slate-400 py-2 px-3 hover:bg-slate-700"
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
