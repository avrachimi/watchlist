import Head from "next/head";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { LoadingPage } from "~/components/loading";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { Movie } from "@prisma/client";
import { useRouter } from "next/router";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

const ReviewStars = ({ rating }: { rating: number }) => {
  let reviewComponent = [];
  for (let i = 0; i < 5; i++) {
    if (rating - i >= 1) {
      reviewComponent.push(<BsStarFill key={i} />);
    } else if (rating - i > 0 && rating - i < 1) {
      reviewComponent.push(<BsStarHalf key={i} />);
    } else {
      reviewComponent.push(<BsStar key={i} />);
    }
  }

  return <div className="left-0 flex gap-1 text-left">{reviewComponent}</div>;
};

const SingleMovie = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  let { id } = router.query;

  if (typeof id !== "string" || !id) id = "";

  const { data: movie, isLoading: moviesLoading } = api.movie.getById.useQuery({
    id: id,
  });

  if (moviesLoading) return <LoadingPage />;

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
          <div className="my-2 text-3xl">{movie.title}</div>
          <img
            src={movie.imageUrl}
            className="my-3 w-[65%] border object-contain"
          />
          <ReviewStars rating={movie.friendRating} />
          <div className="mt-5 flex w-full items-center justify-around text-center">
            <div>
              <span className="text-sm">IMDB</span>
              <ReviewStars rating={movie.imdbRating} />
            </div>
            <div>
              <span className="text-sm">Rotten</span>
              <ReviewStars rating={movie.rottenRating} />
            </div>
            <div>
              <span className="text-sm">Metacritic</span>
              <ReviewStars rating={movie.metacriticRating} />
            </div>
          </div>
          <div className="text-md my-10 px-4 text-center">{movie.plot}</div>
          <div className="my-2 flex w-full flex-col items-center justify-center text-center">
            <span className="text-lg underline">Watched By</span>
            <span>
              {movie.watchedBy.map((user) => (
                <div className="text-sm">{user.name}</div>
              ))}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="my-5 rounded-lg border-2 border-slate-400 py-2 px-3 hover:bg-slate-700"
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
