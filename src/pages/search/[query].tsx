import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { useRouter } from "next/router";
import { SearchFeed } from "~/components/SearchFeed";
import ErrorPage from "~/components/ErrorPage";

const Search = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  let { query } = router.query;

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
  if (typeof query !== "string")
    return (
      <ErrorPage
        name="Search Error"
        details="Something went wrong. Try again."
      />
    );
  return (
    <>
      <Head>
        <title>Watchlist</title>
        <meta name="description" content="Movie and tv show recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-900 pb-10">
        <Navbar query={query} />
        <SearchFeed query={typeof query === "string" ? query : ""} />
      </main>
    </>
  );
};

export default Search;
