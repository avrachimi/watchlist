import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { Feed } from "~/components/Feed";
import { ColorModeScript } from "@chakra-ui/react";

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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-w-screen min-h-screen bg-gray-900 pb-5">
        <ColorModeScript />
        <Navbar />
        <Feed />
      </main>
    </>
  );
};

export default Home;
