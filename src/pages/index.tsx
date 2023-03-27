import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import thumbnail from "~/thumbnail.jpg";
import { AiFillStar, AiOutlineStar, AiTwotoneEye } from "react-icons/ai";

import { api } from "~/utils/api";
import { Navbar } from "~/components/navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { z } from "zod";
import { TRPCClientError } from "@trpc/client";
import externalApi from "~/server/services/externalApi";
import { LoadingPage } from "~/components/loading";

const Feed = () => {
  const { data, isLoading: moviesLoading } = api.movies.getAll.useQuery();

  if (moviesLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong {}</div>;

  console.log(data[0]?.imageUrl);
  return (
    <div className="">
      <div className="m-1.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {data?.map((movie) => (
          <div
            key={movie.id}
            className="m-2 flex flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
          >
            <img
              src={movie.imageUrl}
              className="h-80 w-full justify-self-start border object-cover sm:h-60"
            />
            <div className="flex h-28 w-full flex-col items-center justify-between">
              <div className="mt-2 text-center text-xl">{movie.title}</div>
              <div className="w-[80%] py-1 pt-3 text-center text-sm">
                {/* {movie.plot} */}
                some details here
              </div>
              <div className="mt-1 grid w-full grid-cols-2 items-end px-2 pb-2">
                <div className="flex scale-90">
                  {movie.imdbRating >= 1 && <AiFillStar />}
                  {movie.imdbRating >= 2 && <AiFillStar />}
                  {movie.imdbRating >= 3 && <AiFillStar />}
                  <AiFillStar />
                  <AiOutlineStar />
                </div>
                <div className="text-right text-sm">
                  <div className="flex items-center justify-end">
                    <AiTwotoneEye className="mx-1" />
                    <span>5 friends</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default Home;
