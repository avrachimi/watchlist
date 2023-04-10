import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiTwotoneEye } from "react-icons/ai";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import ReviewStars from "./ReviewStars";

export const Feed = () => {
  const { data: sessionData } = useSession();
  const { data: watchedMovies, isLoading: watchedMoviesLoading } =
    api.watched.getWatchedMoviesbyUserId.useQuery({
      userId: sessionData?.user.id ?? "",
    });
  const [includeWatched, setIncludeWatched] = useState(true);
  const [isSeries, setIsSeries] = useState(true);
  const { data: allMovieData, isLoading } = api.movie.getAll.useQuery();
  const { data: series, isLoading: seriesLoading } =
    api.movie.getAllSeries.useQuery();
  const { data: movies, isLoading: moviesLoading } =
    api.movie.getAllMovies.useQuery();
  const [data, setData] = useState<typeof allMovieData>(undefined);

  useEffect(() => {
    console.log("triggered isSeries useEffect");
    setData(isSeries ? series : movies);
    console.log(data);
  }, [isSeries, seriesLoading]);

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;
  if (data.length === 0)
    return (
      <div className="m-5 mt-10 flex flex-col items-center justify-center rounded-lg border-2 p-4 text-center text-xl">
        No movies added to database.
        <div className="mt-2">
          Search for a movie and add it to the database to start.
        </div>
      </div>
    );

  const watchedMovieIds: string[] = [];
  watchedMovies?.map((watchedMovie) => {
    watchedMovieIds.push(watchedMovie.movieId);
  });

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mt-2 flex w-full justify-between px-3">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            checked={isSeries}
            type="checkbox"
            value=""
            className="peer sr-only"
            onChange={() => setIsSeries((prev) => !prev)}
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {isSeries ? "Series" : "Movies"}
          </span>
        </label>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            checked={includeWatched}
            type="checkbox"
            value=""
            className="peer sr-only"
            onChange={() => setIncludeWatched((prev) => !prev)}
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {includeWatched ? "Including watched" : "Excluding watched"}
          </span>
        </label>
      </div>
      <div className="m-1.5 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {!includeWatched &&
          data?.map((movie) =>
            !watchedMovieIds.includes(movie.id) ? (
              <Link
                href={`/movies/${movie.id}`}
                key={movie.id}
                className="m-2 flex flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
              >
                <img
                  src={movie.imageUrl}
                  className="block h-60 w-full border-b object-cover"
                />
                <div className="flex h-fit w-full flex-col items-center justify-between">
                  <div className="mt-2 w-full text-center text-sm font-bold">
                    {movie.title}
                  </div>
                  <div className="mt-3 flex w-full flex-col items-center justify-center px-1 pb-2">
                    <ReviewStars rating={movie.friendRating} />
                    <div className="text-right text-sm">
                      <div className="mt-1 flex items-center justify-end">
                        <AiTwotoneEye className="mx-1" />
                        <span>{movie.Watched.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null
          )}
        {includeWatched &&
          data?.map((movie) => (
            <Link
              href={`/movies/${movie.id}`}
              key={movie.id}
              className="m-2 flex flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
            >
              <img
                src={movie.imageUrl}
                className="block h-60 w-full border-b object-cover"
              />
              <div className="flex h-fit w-full flex-col items-center justify-between">
                <div className="mt-2 w-full text-center text-sm font-bold">
                  {movie.title}
                </div>
                <div className="mt-3 flex w-full flex-col items-center justify-center px-1 pb-2">
                  <ReviewStars rating={movie.friendRating} />
                  <div className="text-right text-sm">
                    <div className="mt-1 flex items-center justify-end">
                      <AiTwotoneEye className="mx-1" />
                      <span>{movie.Watched.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};
