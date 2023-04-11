import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { useRouter } from "next/router";
import placeholderProfilePic from "../../../public/profile.jpg";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import WatchlistMovies from "~/components/WatchlistMovies";

dayjs.extend(relativeTime);

const Watchlist = () => {
  const { data: sessionData } = useSession();
  const { data: user, isLoading: isLoadingUser } = api.user.getById.useQuery({
    id: sessionData?.user.id ?? "",
  });

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

  if (isLoadingUser) return <LoadingPage />;

  if (!user) return <div>Something went wrong. Try again.</div>;

  return (
    <>
      <Head>
        <title>Watchlist</title>
        <meta name="description" content="Movie and tv show recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex w-full flex-col">
          <WatchlistMovies
            userId={user.id}
            type="movie"
            title="Watchlist - Movies"
          />
          <WatchlistMovies
            userId={user.id}
            type="series"
            title="Watchlist - Series"
          />
        </div>
      </main>
    </>
  );
};

export default Watchlist;
