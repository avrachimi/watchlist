import Link from "next/link";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";

export const SearchFeed = ({ query }: { query: string }) => {
  const { data: movies, isLoading: moviesLoading } =
    api.external.getSearch.useQuery({ query: query });

  if (moviesLoading) return <LoadingPage />;

  if (!movies) return <div>Something went wrong {}</div>;

  return (
    <div className="">
      <div className="m-1.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {movies.map((movie) => (
          <Link
            href={`/search/movies/${movie.imdbID}`}
            key={movie.imdbID}
            className="m-2 flex flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
          >
            <img
              src={movie.Poster}
              className="h-80 w-full justify-self-start border object-cover sm:h-60"
            />
            <div className="flex h-28 w-full flex-col items-center justify-between">
              <div className="mt-2 text-center text-xl">{movie.Title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
