import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiTwotoneEye } from "react-icons/ai";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import ReviewStars from "./ReviewStars";

export const RecentlyAddedFeed = () => {
  const { data: sessionData } = useSession();
  const { data: watchedMovies, isLoading: watchedMoviesLoading } =
    api.watched.getWatchedMoviesbyUserId.useQuery({
      userId: sessionData?.user.id ?? "",
    });
  const [includeWatched, setIncludeWatched] = useState<boolean>(
    JSON.parse(
      window.localStorage.getItem("includeWatched") ?? JSON.stringify(true)
    ) ?? true
  );
  const [isSeries, setIsSeries] = useState<boolean>(
    JSON.parse(
      window.localStorage.getItem("isSeries") ?? JSON.stringify(true)
    ) ?? true
  );
  const { data: sortedMovieData, isLoading } =
    api.movie.getAllSortedByRecent.useQuery();
  const { data: series, isLoading: seriesLoading } =
    api.movie.getAllSortedByRecent.useQuery();
  const { data: movies, isLoading: moviesLoading } =
    api.movie.getAllMovies.useQuery();
  const [data, setData] = useState<typeof sortedMovieData>(undefined);

  useEffect(() => {
    console.log("triggered isSeries useEffect");
    setData(isSeries ? series : movies);
    console.log(data);

    window.localStorage.setItem("isSeries", isSeries.toString());
  }, [isSeries, seriesLoading, moviesLoading]);

  useEffect(() => {
    window.localStorage.setItem("includeWatched", includeWatched.toString());
    console.log(JSON.parse(window.localStorage.getItem("includeWatched")!));
  }, [includeWatched]);

  useEffect(() => {
    setIncludeWatched(
      JSON.parse(window.localStorage.getItem("includeWatched")!)
    );

    setIsSeries(JSON.parse(window.localStorage.getItem("isSeries")!));
  }, []);

  if (isLoading) return <LoadingPage />;

  if (!sortedMovieData) return <div>Something went wrong</div>;
  if (sortedMovieData.length === 0)
    return (
      <div className="m-5 mt-10 flex flex-col items-center justify-center rounded-lg border-2 p-4 text-center text-xl">
        No movies added to database.
        <div className="mt-2">
          Search for a movie and add it to the database to start.
        </div>
      </div>
    );

  const watchedMovieIds: string[] = [];
  watchedMovies?.map((watched) => {
    if (watched.userId === sessionData?.user.id)
      watchedMovieIds.push(watched.movieId);
  });

  const toggleIncludeWatched = () => {
    setIncludeWatched((prev) => !prev);
  };

  const toggleType = () => {
    setIsSeries((prev) => !prev);
  };

  const getShortMovieTitle = (title: string) => {
    const maxLength = 20;
    if (title.length > maxLength) return title.substring(0, maxLength) + "..";
    return title;
  };

  return (
    <div className="flex w-full flex-col justify-center sm:px-5 2xl:px-20">
      <div className="mx-5 my-2 mt-4 text-sm text-gray-400">
        Showing recently added movies you haven't watched yet.
      </div>
      <div className="flex w-full justify-center">
        <div className="mx-3 mb-2 grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {sortedMovieData?.map((movie) =>
            !watchedMovieIds.includes(movie.id) ? (
              <Link
                href={`/movies/${movie.id}`}
                key={movie.id}
                className="m-2 flex flex-col justify-between overflow-hidden rounded-lg border-2 border-slate-200"
              >
                <img
                  src={movie.imageUrl}
                  className="block h-60 w-full border-b object-cover"
                />
                <div className="flex w-full flex-col items-center justify-between">
                  <div className="mt-2 w-full text-center text-sm font-bold">
                    {getShortMovieTitle(movie.title)}
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
        </div>
      </div>
    </div>
  );
};
