import Head from "next/head";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { LoadingPage } from "~/components/loading";
import { useRouter } from "next/router";
import ReviewStars from "~/components/ReviewStars";
import { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import placeholderProfilePic from "../../../public/profile.jpg";
import { Prisma } from "@prisma/client";

type ratingType = Prisma.RatingGetPayload<{
  include: {
    user: true;
  };
}>;

const SingleMovie = () => {
  const [watchedBy, setWatchedBy] = useState([""]);
  const [reviews, setReviews] = useState<ratingType[]>([]);
  const { data: sessionData } = useSession();
  const router = useRouter();
  let { id } = router.query;
  const { mutate: mutateWatched, error: errorWatched } =
    api.watched.markWatched.useMutation();

  const { data: watchedUsers } = api.watched.getWatchedUsersByMovieId.useQuery({
    id: typeof id === "string" ? id : "",
  });
  useEffect(() => {
    const watchedUserList: string[] = [];
    watchedUsers?.map((watchedUser) => {
      if (watchedUser.user.name) watchedUserList.push(watchedUser.user.name);
    });
    setWatchedBy(watchedUserList);
    console.log(watchedUsers);
  }, [watchedUsers]);

  const { data: movie, isLoading: moviesLoading } = api.movie.getById.useQuery({
    id: typeof id === "string" ? id : "",
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
    mutateWatched({ movieId: movie.id, userId: sessionData.user.id });
    setWatchedBy((prevVal) => [...prevVal, sessionData.user.name]);
  };

  const WriteReview = ({
    movieId,
    userId,
  }: {
    movieId: string;
    userId: string;
  }) => {
    const {
      mutate: mutateRating,
      error: errorRating,
      data: mutatedRating,
    } = api.rating.create.useMutation();
    const { mutate: mutateMovieRatings, error: errorMovieRatings } =
      api.movie.updateRatings.useMutation();
    const [rating, setRating] = useState(0.0);
    const [review, setReview] = useState("");

    const incrementRating = () => {
      if (rating < 5) setRating((prevRating) => (prevRating += 0.5));
    };

    const decrementRating = () => {
      if (rating > 0) setRating((prevRating) => (prevRating -= 0.5));
    };

    return (
      <div className="rounded-lg border">
        <div className="p-2 text-center text-xl">Write a review</div>
        <form
          className="flex flex-col items-center justify-center gap-2 p-2"
          onSubmit={(e) => {
            e.preventDefault();

            mutateRating({
              rating: rating,
              review: review,
              movieId: movieId,
              userId: userId,
            });

            mutateMovieRatings({ movieId: movieId, reviews: reviews });
            if (mutatedRating) {
              setReviews((prevReviews) => [...prevReviews, mutatedRating]);
            }
          }}
        >
          <div className="flex w-full flex-col">
            <div className="my-1 flex items-center justify-center">
              <button
                type="button"
                className="mx-2 rounded-lg border-2 px-4 py-1 text-center text-2xl"
                onClick={decrementRating}
              >
                -
              </button>
              <input
                className="w-28 rounded-md bg-gray-900 text-center text-6xl"
                id="rating"
                name="rating"
                type="number"
                min={0}
                max={5}
                value={rating}
                step={0.25}
                required
                readOnly
                disabled
              />
              <button
                type="button"
                className="mx-2 rounded-lg border-2 px-4 py-1 text-center text-2xl"
                onClick={incrementRating}
              >
                +
              </button>
            </div>
            <div className="mb-2 flex items-center justify-center">
              <ReviewStars rating={rating} />
            </div>
            <textarea
              className="w-full rounded-md text-black"
              id="review"
              name="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          {errorRating?.data?.zodError?.fieldErrors.rating && (
            <span className="mb-8 text-red-500">
              {errorRating.data.zodError.fieldErrors.rating}
            </span>
          )}
          {errorRating?.data?.zodError?.fieldErrors.review && (
            <span className="mb-8 text-red-500">
              {errorRating.data.zodError.fieldErrors.review}
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
    const { data: ratings, isLoading: ratingsLoading } =
      api.rating.getByMovieId.useQuery({
        movieId: movieId,
      });
    const { mutate: deleteMutation, isLoading: ratingDeletionLoading } =
      api.rating.delete.useMutation();

    useEffect(() => {
      if (ratings) setReviews(ratings);
    }, [ratingsLoading]);

    if (!ratings) return <div>No ratings found</div>;

    const deleteRating = (id: string) => {
      deleteMutation({ id: id });

      if (!ratingDeletionLoading) {
        const currReviews: ratingType[] = [];
        reviews.map((review) =>
          review.id !== id ? currReviews.push(review) : null
        );
        setReviews(currReviews);
      }
    };

    const reviewComponents = [];

    for (let rating of reviews) {
      reviewComponents.push(
        <div key={rating.id} className="my-5 rounded-md border p-3">
          <div className="flex flex-col items-center justify-center border-b pb-2">
            <div className="mb-2 flex w-full items-center justify-between">
              <img
                className="h-10 rounded-full"
                src={rating.user.image ?? placeholderProfilePic.src}
                alt="Profile Pic"
              />
              <div className="text-xl">{rating.rating} / 5</div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="text-md">{rating.user.name}</div>
              <div>
                <ReviewStars rating={rating.rating} />
              </div>
            </div>
          </div>
          <div className="m-2 mt-4 text-sm">{rating.review}</div>
          <div className="flex items-center justify-between">
            <div className="mx-2 text-sm text-gray-400">
              {rating.createdAt.toLocaleString()}
            </div>
            {sessionData.user.id === rating.userId && (
              <button
                className="my-1 rounded-lg border-2 border-gray-400 bg-red-700 px-2 py-1 text-center text-lg"
                onClick={() => deleteRating(rating.id)}
              >
                Delete
              </button>
            )}
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
          <div className="my-2 px-2 text-center text-3xl">{movie.title}</div>
          <img
            src={movie.imageUrl}
            className="my-3 w-[65%] border object-contain"
          />
          <ReviewStars rating={Math.floor(movie.friendRating * 2) / 2} />
          <div className="mt-5 flex w-full items-center justify-around text-center">
            {movie.imdbRating > 0 && (
              <div className="rounded-md border py-1 px-2">
                <div className="mb-2 border-b pb-1 text-sm">IMDb</div>
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
              {watchedBy.map((userName) => (
                <div key={userName} className="text-sm">
                  {userName}
                </div>
              ))}
            </span>
            {!watchedBy.includes(sessionData.user.name) && (
              <button
                className="mt-10 rounded-md border-2 bg-green-800 p-2 text-gray-200"
                onClick={markWatched}
              >
                Mark as watched
              </button>
            )}
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
