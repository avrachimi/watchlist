import Head from "next/head";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useRouter } from "next/router";
import ReviewStars from "~/components/ReviewStars";
import { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import placeholderProfilePic from "../../../public/profile.jpg";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import ErrorPage from "~/components/ErrorPage";

dayjs.extend(relativeTime);

type ratingType = Prisma.RatingGetPayload<{
  include: {
    user: true;
  };
}>;

const SingleMovie = () => {
  const [watchedBy, setWatchedBy] = useState([""]);
  const [isInWatchlist, setInWatchlist] = useState(true);
  const { data: sessionData } = useSession();
  const router = useRouter();
  let { id } = router.query;
  id = typeof id === "string" ? id : "";

  const { mutate: mutateWatched, error: errorWatched } =
    api.watched.markWatched.useMutation();
  const { mutate: mutateWatchlist, error: errorWatchlist } =
    api.watchlist.add.useMutation();
  const { data: watchlist, isLoading: watchlistLoading } =
    api.watchlist.getWatchlistMovie.useQuery({
      userId: sessionData?.user.id ?? "",
      movieId: id,
    });
  const { data: ratings, isLoading: ratingsLoading } =
    api.rating.getByMovieId.useQuery({
      movieId: id,
    });
  const { mutate: mutateFriendRating } = api.movie.updateRatings.useMutation();
  const [reviews, setReviews] = useState<ratingType[]>([]);
  const [reviewed, setReviewed] = useState(false);
  const [deletedReview, setDeletedReview] = useState(false);

  const { data: watchedUsers } = api.watched.getWatchedUsersByMovieId.useQuery({
    id: id,
  });

  useEffect(() => {
    const watchedUserList: string[] = [];
    watchedUsers?.map((watchedUser) => {
      if (watchedUser.user.name) watchedUserList.push(watchedUser.user.name);
    });
    setWatchedBy(watchedUserList);
    console.log(watchedUsers);
  }, [watchedUsers]);

  useEffect(() => {
    setInWatchlist(watchlist ? true : false);
  }, [watchlistLoading]);

  useEffect(() => {
    if (!ratingsLoading) {
      if (ratings) setReviews(ratings);
      let result = false;
      ratings?.map((rating) => {
        if (rating.userId === sessionData?.user.id) result = true;
      });
      setReviewed(result);
    }
  }, [ratingsLoading]);

  useEffect(() => {
    let result = false;
    reviews.map((rating) => {
      if (rating.userId === sessionData?.user.id) result = true;
    });
    setReviewed(result);
  }, [deletedReview]);

  const { data: movie, isLoading: moviesLoading } = api.movie.getById.useQuery({
    id: typeof id === "string" ? id : "",
  });

  if (moviesLoading) return <LoadingPage />;

  if (!movie)
    return (
      <ErrorPage
        name="Error"
        details="Couldn't load movie. Try again by refreshing the page."
      />
    );

  if (!sessionData?.user) {
    return NextResponse.redirect("https://watch.avrachimi.com");
  }

  const markWatched = () => {
    mutateWatched({ movieId: movie.id, userId: sessionData.user.id });
    setWatchedBy((prevVal) => [...prevVal, sessionData.user.name]);
  };

  const addToWatchlist = () => {
    mutateWatchlist({ movieId: movie.id, userId: sessionData.user.id });
    setInWatchlist(true);
  };

  const getHoursAndMinutes = (duration: number) => {
    let durationFloat = duration / 60;
    let hours = parseInt(durationFloat.toString());
    let minutes = Math.floor((((durationFloat * 100) % 100) / 100) * 60);

    let stringHours = hours.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    let stringMinutes = minutes.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    if (minutes <= 0) return `${hours} hours`;

    return `${stringHours}:${stringMinutes}`;
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
      <div className="rounded-lg border-4 border-slate-200 bg-gray-900 p-2 shadow-md shadow-slate-600">
        <div className="p-2 text-center text-xl">Write review</div>
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

            mutateMovieRatings({
              movieId: movieId,
              reviews: reviews,
              imdbId: movie.imdbId,
              currRating: rating,
            });

            if (!errorRating && !watchedBy.includes(sessionData.user.name))
              markWatched();

            const newReview: ratingType = {
              id: "N/A",
              createdAt: new Date(),
              updatedAt: new Date(),
              rating: rating,
              review: review,
              movieId: movieId,
              userId: userId,
              user: { ...sessionData.user, emailVerified: new Date() },
            };
            setReviews([...reviews, newReview]);
            setReviewed(true);
            setDeletedReview(false);

            console.log(reviews);
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
                className="w-28 rounded-md bg-gray-900 text-center text-6xl text-gray-200"
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
              id="review"
              name="review"
              className="row-span-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your thoughts here..."
            ></textarea>
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
            className="m-2 w-fit rounded-lg border-2 bg-gray-600 px-3 py-1 text-lg"
            type="submit"
          >
            POST
          </button>
        </form>
      </div>
    );
  };

  const Reviews = ({ movieId }: { movieId: string }) => {
    const { mutate: deleteMutation, isLoading: ratingDeletionLoading } =
      api.rating.delete.useMutation();
    const { mutate: mutateMovieRatings, error: errorMovieRatings } =
      api.movie.updateRatings.useMutation();

    if (ratingsLoading) return <LoadingPage />;

    if (!ratings) return <div>No ratings found</div>;

    const deleteRating = (userId: string, movieId: string) => {
      deleteMutation({ userId: userId, movieId: movieId });
      let rating =
        reviews.find((review) => {
          review.user.id === sessionData.user.id;
        })?.rating ?? 0.000001;

      if (!ratingDeletionLoading) {
        const currReviews: ratingType[] = [];
        let hasReviewed = false;

        reviews.map((review) => {
          if (review.userId !== userId) currReviews.push(review);
          if (review.userId === sessionData.user.id && review.id === "N/A")
            hasReviewed = true;
        });
        setReviews(currReviews);
        setReviewed(hasReviewed);
        setDeletedReview(true);
        mutateMovieRatings({
          movieId: movieId,
          reviews: reviews,
          imdbId: movie.imdbId,
          currRating: -rating,
        });
      }
    };

    const reviewComponents = [];

    for (let review of reviews) {
      reviewComponents.push(
        <div key={review.id} className="my-5 rounded-md border p-3">
          <div className="flex flex-col items-center justify-center border-b pb-2">
            <div className="mb-2 flex w-full items-center justify-between">
              <img
                className="h-10 rounded-full"
                src={review.user.image ?? placeholderProfilePic.src}
                alt="Profile Pic"
              />
              <div className="text-xl">{review.rating} / 5</div>
            </div>
            <div className="flex w-full items-center justify-between">
              <Link
                href={
                  review.userId === sessionData.user.id
                    ? `/profile`
                    : `/profile/${review.userId}`
                }
              >
                <div className="text-md">{review.user.name}</div>
              </Link>
              <div>
                <ReviewStars rating={review.rating} />
              </div>
            </div>
          </div>
          <div className="m-2 mt-4 text-sm">{review.review}</div>
          <div className="flex items-center justify-between">
            <div className="mx-2 text-sm text-gray-400">
              {dayjs(review.updatedAt).fromNow()}
            </div>
            {sessionData.user.id === review.userId && (
              <button
                className="my-1 rounded-lg border-2 border-gray-400 bg-red-700 px-2 py-1 text-center text-lg"
                onClick={() => deleteRating(review.userId, review.movieId)}
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
        {!reviewed && (
          <WriteReview movieId={movie.id} userId={sessionData.user.id} />
        )}
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
        <div className="mt-5 flex flex-col items-center justify-center">
          <div className="my-2 px-2 text-center text-3xl">{movie.title}</div>
          <div className="mb-4 flex flex-col items-center justify-center md:flex-row">
            <div className="flex flex-col items-center justify-center md:flex-row lg:w-10/12 xl:w-8/12">
              <div className="flex h-full w-full flex-col items-center justify-center md:m-5 md:w-[50%]">
                <img
                  src={movie.imageUrl}
                  className="my-3 w-[65%] border object-contain md:w-full"
                />
                <ReviewStars rating={movie.friendRating} />
              </div>
              <div className="flex w-4/6 flex-col">
                <div className="text-md my-10 px-4 text-center">
                  {movie.plot}
                </div>
                <div className="mt-5 flex w-full items-center justify-around gap-5 text-center">
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
                      <div className="mb-2 border-b pb-1 text-sm">
                        Metacritic
                      </div>
                      <ReviewStars rating={movie.metacriticRating} />
                      <span className="text-xs">
                        {movie.metacriticRating} / 5
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-10 flex w-full flex-col items-center justify-between gap-4 px-2 text-sm">
                  <div className="flex flex-col items-center">
                    <div className="font-bold">Genre</div>
                    <div>{movie.genre}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-bold">Released</div>
                    <div>{movie.released?.toLocaleString().split(",")[0]}</div>
                  </div>
                  {movie.type === "movie" && movie.runtime !== null && (
                    <div className="flex flex-col items-center">
                      <div className="font-bold">Duration</div>
                      <div>{getHoursAndMinutes(movie.runtime)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="my-2 flex w-full flex-col items-center justify-center text-center">
            <span className="text-lg underline">Watched By</span>
            <span className="mt-2 grid grid-cols-2 gap-3">
              {watchedBy.map((userName) => (
                <div key={userName} className="rounded-md border px-2 text-sm">
                  {userName}
                </div>
              ))}
            </span>
            {!isInWatchlist && !watchedBy.includes(sessionData.user.name) && (
              <button
                className="mt-10 rounded-md border-2 bg-green-800 p-2 text-gray-200"
                onClick={addToWatchlist}
              >
                Add to Watchlist
              </button>
            )}
          </div>
          <div className="my-8 flex w-full flex-col items-center justify-center lg:w-10/12 xl:w-8/12">
            <Reviews movieId={movie.id} />
          </div>
        </div>
      </main>
    </>
  );
};

export default SingleMovie;
