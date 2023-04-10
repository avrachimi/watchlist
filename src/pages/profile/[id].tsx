import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { useRouter } from "next/router";
import placeholderProfilePic from "../../../public/profile.jpg";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import ReviewStars from "~/components/ReviewStars";

dayjs.extend(relativeTime);

const Search = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  let { id } = router.query;
  id = typeof id === "string" ? id : "";
  const { data: user, isLoading: isLoadingUser } = api.user.getById.useQuery({
    id: id,
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

  if (!user) return <div>Something went wrong. Try again.</div>;

  let moviesWatchedCount = user.Watched.filter(
    (watched) => watched.userId === user.id && watched.movie.type === "movie"
  ).length;

  let seriesWatchedCount = user.Watched.filter(
    (watched) => watched.userId === user.id && watched.movie.type === "series"
  ).length;

  const getUserRating = (movieId: string) => {
    let result = 0;

    user.Rating.map((rating) => {
      if (rating.userId === user.id && rating.movieId === movieId)
        result = rating.rating;
    });
    return result;
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
        <div className="mx-4 flex flex-col items-center justify-center border-b pb-2">
          <div className="m-2 mt-5 flex w-[50%] items-center justify-center">
            <img
              className="rounded-full border-4 border-gray-400"
              src={user.image ?? placeholderProfilePic.src}
              alt="Profile Pic"
            />
          </div>
          <div className="text-2xl">{user.name}</div>
          <div className="mt-2 flex w-full items-center justify-around text-xs">
            <div className="flex w-full justify-center border-r">
              {moviesWatchedCount} movies
            </div>
            <div className="flex w-full justify-center border-l">
              {seriesWatchedCount} shows
            </div>
          </div>
        </div>
        <div className="mx-4 mt-4 flex flex-col">
          <div className="mb-2 border-b text-lg">Watched Movies</div>
          <div className="grid grid-cols-2">
            {user.Watched.map((watched) =>
              watched.movie.type === "movie" ? (
                <Link
                  href={`/movies/${watched.movie.id}`}
                  key={watched.movie.id}
                  className="m-2 flex flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
                >
                  <img
                    src={watched.movie.imageUrl}
                    className="block h-60 w-full border-b object-cover"
                  />
                  <div className="flex h-fit w-full flex-col items-center justify-between">
                    <div className="my-2 text-center text-xl">
                      {watched.movie.title}
                    </div>
                    <div className="mt-1 mb-2">
                      <span className="mb-1 flex justify-center text-xs">
                        This user's rating
                      </span>
                      <ReviewStars rating={getUserRating(watched.movieId)} />
                    </div>
                  </div>
                </Link>
              ) : null
            )}
          </div>
        </div>
        <div className="mx-4 mt-4 flex flex-col">
          <div className="mb-2 border-b text-lg">Watched Shows</div>
          <div className="grid grid-cols-2">
            {user.Watched.map((watched, index) =>
              watched.movie.type === "series" ? (
                <Link
                  href={`/movies/${watched.movie.id}`}
                  key={watched.movie.id}
                  className="m-2 flex flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
                >
                  <img
                    src={watched.movie.imageUrl}
                    className="block h-60 w-full border-b object-cover"
                  />
                  <div className="flex h-fit w-full flex-col items-center justify-between">
                    <div className="my-2 text-center text-xl">
                      {watched.movie.title}
                    </div>
                    <div className="mt-1 mb-2">
                      <span className="mb-1 flex justify-center text-xs">
                        This user's rating
                      </span>
                      <ReviewStars rating={getUserRating(watched.movieId)} />
                    </div>
                  </div>
                </Link>
              ) : null
            )}
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

export default Search;