import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AiTwotoneEye } from "react-icons/ai";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import ReviewStars from "./ReviewStars";

type movieType = Prisma.MovieGetPayload<{
  include: {
    Watched: {
      include: {
        user: true;
      };
    };
    Rating: true;
  };
}>;

export const Feed = () => {
  const { data, isLoading: moviesLoading } = api.movie.getAll.useQuery();
  const { data: sessionData } = useSession();

  if (moviesLoading) return <LoadingPage />;

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

  const maxPlotLength = 70;

  const getAvgRating = (ratings: any) => {
    let sum = 0;
    for (let rating of ratings) {
      sum += rating.rating;
    }
    const avg = sum / ratings.length;
    return avg ? avg : 0.0;
  };

  return (
    <div className="">
      <div className="m-1.5 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {data?.map((movie) => (
          <Link
            href={`/movies/${movie.id}`}
            key={movie.id}
            className="m-2 flex flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-slate-200"
          >
            <img
              src={movie.imageUrl}
              className="block h-auto max-h-60 w-full border-b object-cover"
            />
            <div className="flex h-full w-full flex-col items-center justify-between">
              <div className="mt-2 w-full text-center text-sm font-bold">
                {movie.title}
              </div>
              <div className="mt-3 flex w-full flex-col items-center justify-center px-1 pb-2">
                <ReviewStars rating={Math.floor(movie.friendRating * 2) / 2} />
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
