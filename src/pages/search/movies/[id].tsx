import Head from "next/head";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { LoadingPage } from "~/components/loading";
import { useRouter } from "next/router";
import { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import Link from "next/link";

const SingleSearchMovie = () => {
  const [watchedBy, setWatchedBy] = useState([""]);
  const { data: sessionData } = useSession();
  const router = useRouter();
  let { id } = router.query;
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
    if (!movie) {
      await mutateMovie(movie);
      setWatchedBy((prevVal) => [...prevVal, sessionData.user.name]);
    }
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
            {!movie && (
              <button
                className="mt-10 rounded-md border-2 bg-green-800 p-2 text-gray-200"
                onClick={markWatched}
              >
                Add to database
              </button>
            )}
            {movie && (
              <div className="w-[80%] rounded-md border-2 border-red-900 bg-red-800 bg-opacity-70 px-2">
                Movie already added to database.
                <div>
                  Visit{" "}
                  <Link href={`/`} className="underline">
                    Home
                  </Link>{" "}
                  to find movies in our database.
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default SingleSearchMovie;
