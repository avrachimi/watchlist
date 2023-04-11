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

  if (watchlistLoading) return <LoadingSpinner />;

  if (!watchlistMovies) return <div>Something went wrong. Try again.</div>;
  console.log(watchlistMovies);
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
                      {watchlist.movie.title}
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
                      {watchlist.movie.title}
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
