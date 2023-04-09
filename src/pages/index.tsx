import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { AiTwotoneEye } from "react-icons/ai";
import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";

import { api } from "~/utils/api";
import { Navbar } from "~/components/navbar";
import { LoadingPage } from "~/components/loading";
import ReviewStars from "~/components/ReviewStars";

const Feed = () => {
  const { data, isLoading: moviesLoading } = api.movie.getAll.useQuery();

  if (moviesLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong {}</div>;

  const maxPlotLength = 70;

  const getAvgRating = (ratings: any) => {
    let sum = 0;
    for (let rating of ratings) {
      sum += rating.rating;
    }
    const avg = sum / ratings.length;
    return avg ? avg : 0.0;
  };

  return (
    <div className="">
      <div className="m-1.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {data?.map((movie) => (
          <Link
            href={`/movies/${movie.id}`}
            key={movie.id}
            className="m-2 flex flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
          >
            <img
              src={movie.imageUrl}
              className="h-80 w-full justify-self-start border object-cover sm:h-60"
            />
            <div className="flex h-28 w-full flex-col items-center justify-between">
              <div className="mt-2 text-center text-xl">{movie.title}</div>
              <div className="w-[90%] py-1 text-center text-sm">
                {movie.plot.length < maxPlotLength
                  ? movie.plot
                  : `${movie.plot.substring(0, maxPlotLength)}...`}
              </div>
              <div className="mt-1 grid w-full grid-cols-2 items-end px-1 pb-2">
                <ReviewStars rating={getAvgRating(movie.Rating)} />
                <div className="text-right text-sm">
                  <div className="flex items-center justify-end">
                    <AiTwotoneEye className="mx-1" />
                    <span>{movie.Watched.length} friends</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const { data: sessionData } = useSession();

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

  return (
    <>
      <Head>
        <title>Watchlist</title>
        <meta name="description" content="Movie and tv show recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-900">
        <Navbar />
        <Feed />
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

export default Home;
