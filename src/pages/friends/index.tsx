import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { useRouter } from "next/router";
import placeholderProfilePic from "../../../public/profile.jpg";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import WatchedMovies from "~/components/WatchedMovies";
import Link from "next/link";

dayjs.extend(relativeTime);

const Friends = () => {
  const { data: sessionData } = useSession();
  const { data: users, isLoading: isLoadingUsers } = api.user.getAll.useQuery();

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

  if (isLoadingUsers) return <LoadingPage />;

  if (!users) return <div>Something went wrong. Try again.</div>;

  console.log(users);

  let moviesWatchedCount = (user: (typeof users)[0]) => {
    return user.Watched.filter(
      (watched) => watched.userId === user.id && watched.movie.type === "movie"
    ).length;
  };

  let seriesWatchedCount = (user: (typeof users)[0]) => {
    return user.Watched.filter(
      (watched) => watched.userId === user.id && watched.movie.type === "series"
    ).length;
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
        <div className="flex w-full flex-col">
          <div className="relative overflow-x-auto">
            <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Movies
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Shows
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) =>
                  user.id !== sessionData.user.id ? (
                    <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                      <th
                        scope="row"
                        className="flex items-center gap-3 whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        <div className="flex w-8 items-center justify-center">
                          <img
                            className="rounded-full border border-gray-400"
                            src={user.image ?? placeholderProfilePic.src}
                            alt=""
                          />
                        </div>
                        <Link href={`/profile/${user.id}`}>{user.name}</Link>
                      </th>
                      <td className="px-6 py-4">{moviesWatchedCount(user)}</td>
                      <td className="px-6 py-4">{seriesWatchedCount(user)}</td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default Friends;
