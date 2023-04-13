import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { Feed } from "~/components/Feed";
import { RecentlyAddedFeed } from "~/components/RecentlyAddedFeed";
import { Navbar } from "~/components/navbar";

const RecentlyAdded = () => {
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
      <main className="min-w-screen min-h-screen bg-gray-900 pb-5">
        <Navbar />
        <RecentlyAddedFeed />
      </main>
    </>
  );
};

export default RecentlyAdded;
