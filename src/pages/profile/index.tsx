import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { useRouter } from "next/router";
import placeholderProfilePic from "../../../public/profile.jpg";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import WatchedMovies from "~/components/WatchedMovies";
import WatchlistMovies from "~/components/WatchlistMovies";
import ErrorPage from "~/components/ErrorPage";

dayjs.extend(relativeTime);

const MyProfile = () => {
  const { data: sessionData } = useSession();
  const { data: user, isLoading: isLoadingUser } = api.user.getById.useQuery({
    id: sessionData?.user.id ?? "",
  });

  if (!sessionData?.user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900">
        <button
          className="rounded-xl bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => void signIn()}
        >
          Sign in
        </button>
      </div>
    );
  }

  if (isLoadingUser) return <LoadingPage />;

  if (!user)
    return (
      <ErrorPage
        name="Error"
        details="Couldn't load profile. Try again by refreshing the page."
      />
    );

  let moviesWatchedCount = user.Watched.filter(
    (watched) => watched.userId === user.id && watched.movie.type === "movie"
  ).length;

  let seriesWatchedCount = user.Watched.filter(
    (watched) => watched.userId === user.id && watched.movie.type === "series"
  ).length;

  const getWatchedMoviesLength = () => {
    let watchedMinutesSum = 0;
    user.Watched.map((watched) => {
      if (watched.movie.type === "movie")
        watchedMinutesSum += watched.movie.runtime ?? 0;
    });
    return watchedMinutesSum;
  };

  const getReadableWatchedLength = (minutes: number) => {
    let days = Math.floor(minutes / 24 / 60);
    let hours = Math.floor((minutes / 60) % 24);
    let mins = Math.floor(minutes % 60);

    let daysStr = days >= 1 ? `${days} days,` : "";
    let hoursStr = hours >= 1 ? ` ${hours} hours` : "";
    let minsStr = mins >= 1 ? ` and ${mins} minutes` : "";
    return `${daysStr}${hoursStr}${minsStr}`;
  };

  return (
    <>
      <Head>
        <title>Watchlist</title>
        <meta name="description" content="Movie and tv show recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="mx-4 flex flex-col items-center justify-center pb-2">
          <div className="m-2 mt-5 flex w-[50%] items-center justify-center">
            <img
              className="rounded-full border-4 border-gray-400"
              src={user.image ?? placeholderProfilePic.src}
              alt="Profile"
            />
          </div>
          <div className="text-2xl">{user.name}</div>
          <div className="text-xs text-gray-400">
            Last active {dayjs(user.updatedAt).fromNow()}
          </div>
          <div className="mt-2 flex w-[55%] items-center justify-around text-xs">
            <div className="flex w-full justify-center border-r">
              {moviesWatchedCount} movies
            </div>
            <div className="flex w-full justify-center border-l">
              {seriesWatchedCount} shows
            </div>
          </div>
          <div className="mt-5 flex flex-col items-center justify-center rounded-lg border-2 bg-blue-900 p-2 shadow-md shadow-gray-600">
            <div className="text-lg font-bold">Movie Watch Time</div>
            {getReadableWatchedLength(getWatchedMoviesLength())}
          </div>
        </div>
        <WatchedMovies userId={user.id} title="Watched Movies" type="movie" />
        <WatchedMovies userId={user.id} title="Watched Shows" type="series" />
        <WatchlistMovies userId={user.id} title="Watchlist" type="all" />
        <div className="flex items-center justify-center py-10">
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

export default MyProfile;
