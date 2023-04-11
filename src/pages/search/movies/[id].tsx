import Head from "next/head";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { LoadingPage } from "~/components/loading";
import { useRouter } from "next/router";
import { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import Link from "next/link";
import ErrorPage from "~/components/ErrorPage";

const SingleSearchMovie = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  let { id } = router.query;
  id = typeof id === "string" ? id : "";
  const { data: movie, isLoading: movieLoading } =
    api.external.getDetailedMovie.useQuery({
      imdbId: id,
    });
  const { data: dbMovie, isLoading: dbMovieLoading } =
    api.movie.getByImdbId.useQuery({ imdbId: id });
  const { mutate: mutateMovie, error: errorMovie } =
    api.movie.create.useMutation();
  const [isMovieInDB, setMovieInDB] = useState(false);

  useEffect(() => {
    setMovieInDB(dbMovie ? true : false);
  }, [dbMovieLoading]);

  if (movieLoading || dbMovieLoading) return <LoadingPage />;

  if (!movie)
    return (
      <ErrorPage
        name="Error"
        details="Couldn't load movie. Try again by refreshing the page."
      />
    );

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

  if (dbMovie && isMovieInDB) router.push(`/movies/${dbMovie?.id}`);

  const markWatched = async () => {
    if (!dbMovie) {
      await mutateMovie(movie);
      setMovieInDB(true);
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
            {!isMovieInDB && (
              <button
                className="mt-10 rounded-md border-2 bg-green-800 p-2 text-gray-200"
                onClick={markWatched}
              >
                Add to database
              </button>
            )}
            {isMovieInDB && !dbMovie && (
              <div className="mb-10 w-[80%] rounded-md border-2 border-red-900 bg-red-800 bg-opacity-70 px-2">
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
            {isMovieInDB && dbMovie && (
              <div className="mb-10 w-[80%] rounded-md border-2 border-red-900 bg-red-800 bg-opacity-70 px-2">
                Movie already added to database.
                <div>
                  Click{" "}
                  <Link href={`/movies/${dbMovie.id}`} className="underline">
                    here
                  </Link>{" "}
                  to visit movie page.
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
