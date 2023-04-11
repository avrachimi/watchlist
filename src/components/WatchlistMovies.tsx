import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { useRouter } from "next/router";
import placeholderProfilePic from "../../../public/profile.jpg";
import { api } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import ReviewStars from "~/components/ReviewStars";
import ErrorComponent from "./ErrorComponent";

const WatchlistMovies = ({
  userId,
  title,
  type,
}: {
  userId: string;
  title: string;
  type: string;
}) => {
  const { data: watchlistMovies, isLoading: watchlistLoading } =
    api.watchlist.getWatchlistMoviesByUserId.useQuery({ id: userId });
  const { data: user, isLoading: isLoadingUser } = api.user.getById.useQuery({
    id: userId,
  });

  if (watchlistLoading || isLoadingUser) return <LoadingSpinner />;

  if (!watchlistMovies)
    return <ErrorComponent name="Error" details="Couldn't load watchlist" />;

  if (!user)
    return <ErrorComponent name="Error" details="Couldn't load user" />;

  const getShortMovieTitle = (title: string) => {
    const maxLength = 12;
    if (title.length > maxLength) return title.substring(0, maxLength) + "...";
    return title;
  };

  return (
    <>
      <div className="mx-4 mt-4 flex flex-col">
        <div className="mb-2 border-b text-lg">{title}</div>
        <div className="w-auto overflow-x-auto">
          <div className="grid h-fit w-auto grid-flow-col grid-rows-1">
            {watchlistMovies.map((watchlist) =>
              type === "all" ? (
                <Link
                  href={`/movies/${watchlist.movieId}`}
                  key={watchlist.id}
                  className="m-2 flex w-40 flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
                >
                  <img
                    src={watchlist.movie.imageUrl}
                    className="block h-60 w-full border-b object-cover"
                  />
                  <div className="flex h-fit w-full flex-col items-center justify-between">
                    <div className="my-2 text-center text-lg font-bold">
                      {getShortMovieTitle(watchlist.movie.title)}
                    </div>
                    <div className="mt-1 mb-2">
                      <ReviewStars rating={watchlist.movie.friendRating} />
                    </div>
                  </div>
                </Link>
              ) : watchlist.movie.type === type ? (
                <Link
                  href={`/movies/${watchlist.movieId}`}
                  key={watchlist.id}
                  className="m-2 flex w-40 flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
                >
                  <img
                    src={watchlist.movie.imageUrl}
                    className="block h-60 w-full border-b object-cover"
                  />
                  <div className="flex h-fit w-full flex-col items-center justify-between">
                    <div className="my-2 text-center text-lg font-bold">
                      {getShortMovieTitle(watchlist.movie.title)}
                    </div>
                    <div className="mt-1 mb-2">
                      <ReviewStars rating={watchlist.movie.friendRating} />
                    </div>
                  </div>
                </Link>
              ) : null
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WatchlistMovies;
