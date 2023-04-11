import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import ErrorComponent from "./ErrorComponent";
import { LoadingPage } from "./loading";

export const SearchFeed = ({ query }: { query: string }) => {
  const { data: movies, isLoading: moviesLoading } =
    api.external.getSearch.useQuery({ query: query });

  if (moviesLoading) return <LoadingPage />;

  if (!movies)
    return (
      <ErrorComponent
        name="Search Error"
        details="Couldn't find movies with this search term. Try something else."
      />
    );

  return (
    <div className="">
      <div className="m-2 grid grid-cols-2 gap-2 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {movies.map((movie) => (
          <Link
            href={`/search/movies/${movie.imdbID}`}
            key={movie.imdbID}
            className="m-2 flex h-full flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
          >
            <img
              src={movie.Poster}
              className="min-h-60 block h-fit w-full border-b object-cover"
            />
            <div className="flex h-full w-full flex-col items-center justify-center">
              <div className="my-2 text-center text-xl">{movie.Title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
