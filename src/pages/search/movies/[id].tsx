import Head from "next/head";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { LoadingPage } from "~/components/loading";
import { useRouter } from "next/router";
import { NextResponse } from "next/server";
import { useEffect, useState } from "react";

const SingleSearchMovie = () => {
  const [watchedBy, setWatchedBy] = useState([""]);
  const { data: sessionData } = useSession();
  const router = useRouter();
  let { id } = router.query;
  const { mutate: mutateWatched, error: errorWatched } =
    api.watched.markWatched.useMutation();
  const { data: movie, isLoading: movieLoading } =
    api.external.getDetailedMovie.useQuery({
      imdbId: typeof id === "string" ? id : "",
    });
  const { mutate: mutateMovie, error: errorMovie } =
    api.movie.create.useMutation();

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

  if (movieLoading) return <LoadingPage />;

  if (!movie) return <div>Couldn't load movie. Try again.</div>;

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

  const markWatched = async () => {
    await mutateMovie(movie);
    await mutateWatched({ movieId: movie.imdbID, userId: sessionData.user.id });
    setWatchedBy((prevVal) => [...prevVal, sessionData.user.name]);
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
        <div className="flex flex-col items-center justify-center">
          <div className="my-2 text-3xl">{movie.Title}</div>
          <img
            src={movie.Poster}
            className="my-3 w-[65%] border object-contain"
          />
          <div className="text-md my-10 px-4 text-center">{movie.Plot}</div>
          <div className="my-2 flex w-full flex-col items-center justify-center text-center">
            {!watchedBy.includes(sessionData.user.name) && (
              <button
                className="mt-10 rounded-md border-2 bg-green-800 p-2 text-gray-200"
                onClick={markWatched}
              >
                Add to database
              </button>
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

export default SingleSearchMovie;
