import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { useRouter } from "next/router";
import placeholderProfilePic from "../../../public/profile.jpg";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import ReviewStars from "~/components/ReviewStars";

const WatchedMovies = ({
  userId,
  title,
  type,
}: {
  userId: string;
  title: string;
  type: string;
}) => {
  const { data: user, isLoading: isLoadingUser } = api.user.getById.useQuery({
    id: userId,
  });

  if (isLoadingUser) return <LoadingPage />;

  if (!user) return <div>Something went wrong. Try again.</div>;

  const getUserRating = (movieId: string) => {
    let result = 0;

    user.Rating.map((rating) => {
      if (rating.userId === user.id && rating.movieId === movieId)
        result = rating.rating;
    });
    return result;
  };

  return (
    <>
      <div className="mx-4 mt-4 flex flex-col">
        <div className="mb-2 border-b text-lg">{title}</div>
        <div className="w-auto overflow-x-auto">
          <div className="grid h-fit w-auto grid-flow-col grid-rows-1">
            {user.Watched.map((watched) =>
              watched.movie.type === type ? (
                <Link
                  href={`/movies/${watched.movie.id}`}
                  key={watched.movie.id}
                  className="m-2 flex w-40 flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
                >
                  <img
                    src={watched.movie.imageUrl}
                    className="block h-60 w-full border-b object-cover"
                  />
                  <div className="flex h-fit w-full flex-col items-center justify-between">
                    <div className="my-2 text-center text-lg font-bold">
                      {watched.movie.title}
                    </div>
                    <div className="mt-1 mb-2">
                      <span className="mb-1 flex justify-center text-xs">
                        This user's rating
                      </span>
                      <ReviewStars rating={getUserRating(watched.movieId)} />
                    </div>
                  </div>
                </Link>
              ) : null
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WatchedMovies;
