import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { useRouter } from "next/router";
import { SearchFeed } from "~/components/SearchFeed";

const Search = () => {
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
        Profile
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
