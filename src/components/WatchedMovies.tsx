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
import ErrorComponent from "./ErrorComponent";
import React from "react";

const WatchedMovies = ({
  userId,
  title,
  type,
}: {
  userId: string;
  title: string;
  type: string;
}) => {
  const { data: rating, isLoading: isLoadingRating } =
    api.rating.getMoviesByUserId.useQuery({
      userId: userId,
    });

  if (isLoadingRating) return <LoadingPage />;

  if (!rating)
    return <ErrorComponent name="Error" details="Couldn't load user" />;

  const getMovieComponents = () => {
    const components: React.ReactElement[] = [];
    rating.map((rating) => {
      if (rating.movie.type === type) {
        components.push(
          <Link
            href={`/movies/${rating.movie.id}`}
            key={rating.movie.id}
            className="m-2 flex w-40 flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
          >
            <img
              src={rating.movie.imageUrl}
              className="block h-60 w-full border-b object-cover"
            />
            <div className="flex h-fit w-full flex-col items-center justify-between">
              <div className="my-2 text-center text-lg font-bold">
                {getShortMovieTitle(rating.movie.title)}
              </div>
              <div className="mt-1 mb-2">
                <span className="mb-1 flex justify-center text-xs">
                  This user's rating
                </span>
                <ReviewStars rating={getUserRating(rating.movieId)} />
              </div>
            </div>
          </Link>
        );
      }
    });

    return components.length !== 0 ? (
      <div className="mx-4 mt-4 flex flex-col">
        <div className="mb-2 border-b text-lg">{title}</div>
        <div className="w-auto overflow-x-auto">
          <div className="grid h-fit w-auto grid-flow-col grid-rows-1">
            {components}
          </div>
        </div>
      </div>
    ) : null;
  };

  const getUserRating = (movieId: string) => {
    let result = 0;

    rating.map((rating) => {
      if (rating.userId === userId && rating.movieId === movieId)
        result = rating.rating;
    });
    return result;
  };

  const getShortMovieTitle = (title: string) => {
    const maxLength = 12;
    if (title.length > maxLength) return title.substring(0, maxLength) + "...";
    return title;
  };

  return <>{getMovieComponents()}</>;
};

export default WatchedMovies;
