import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiTwotoneEye } from "react-icons/ai";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import ReviewStars from "./ReviewStars";

const DropdownGenre = ({
  setGenres,
}: {
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const items = [
    "All",
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Sport",
    "Thriller",
  ];

  const [showContents, setShowContents] = useState(false);
  const [options, setOptions] = useState(["All"]);

  const toggleDropdownItem = (item: string) => {
    if (options.includes(item)) {
      if (item === "All") {
        setOptions(["All"]);
        setGenres(["All"]);
      } else {
        const index = options.indexOf(item);
        let tempArray = options.slice();
        tempArray.splice(index, 1);
        setOptions(tempArray);
        setGenres(tempArray);
      }
    } else {
      if (item === "All") {
        setOptions(["All"]);
        setGenres(["All"]);
      } else {
        if (options.includes("All")) {
          setOptions([item]);
          setGenres([item]);
        } else {
          setOptions((prev) => [...prev, item]);
          setGenres((prev) => [...prev, item]);
        }
      }
    }

    /* if (options.includes(item)) {
      let result = "";
      if (item === "Movies") result = "Series";
      if (item === "Series") result = "Movies";

      setOptions([result]);
      setGenres(result === "Movies" ? "movie" : "series");
    } else {
      setOptions(items);
      setMovieType("all");
    } */
  };

  return (
    <div className="relative mx-2">
      <button
        id="dropdownCheckboxButton"
        data-dropdown-toggle="dropdownDefaultCheckbox"
        className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-1.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setShowContents((prev) => !prev)}
      >
        Genres
        <svg
          className="ml-2 h-4 w-4"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {showContents && (
        <div
          id="dropdownDefaultCheckbox"
          className="absolute top-0 z-10 mt-10 w-48 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
        >
          <ul
            className="space-y-3 p-3 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownCheckboxButton"
          >
            {items.map((item) => (
              <li>
                <div className="flex items-center">
                  <input
                    onClick={() => toggleDropdownItem(item)}
                    checked={options.includes(item)}
                    id={item}
                    type="checkbox"
                    value=""
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                  />
                  <label
                    htmlFor={item}
                    className="ml-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {item}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const DropdownMovieType = ({
  setMovieType,
}: {
  setMovieType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const items = ["Movies", "Series"];

  const [showContents, setShowContents] = useState(false);
  const [options, setOptions] = useState(items);

  const toggleDropdownItem = (item: string) => {
    if (options.includes(item)) {
      let result = "";
      if (item === "Movies") result = "Series";
      if (item === "Series") result = "Movies";

      setOptions([result]);
      setMovieType(result === "Movies" ? "movie" : "series");
    } else {
      setOptions(items);
      setMovieType("all");
    }
  };

  return (
    <div className="relative mx-2">
      <button
        id="dropdownCheckboxButton"
        data-dropdown-toggle="dropdownDefaultCheckbox"
        className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-1.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setShowContents((prev) => !prev)}
      >
        Type
        <svg
          className="ml-2 h-4 w-4"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {showContents && (
        <div
          id="dropdownDefaultCheckbox"
          className="absolute top-0 z-10 mt-10 w-48 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
        >
          <ul
            className="space-y-3 p-3 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownCheckboxButton"
          >
            {items.map((item) => (
              <li key={item}>
                <div className="flex items-center">
                  <input
                    onClick={() => toggleDropdownItem(item)}
                    checked={options.includes(item)}
                    id={item}
                    type="checkbox"
                    value=""
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                  />
                  <label
                    htmlFor={item}
                    className="ml-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {item}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const FilterBar = ({
  setMovieType,
  setGenres,
}: {
  setMovieType: React.Dispatch<React.SetStateAction<string>>;
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  return (
    <div className="my-2 flex w-fit justify-start">
      <DropdownMovieType setMovieType={setMovieType} />
      <DropdownGenre setGenres={setGenres} />
    </div>
  );
};

export const Feed = () => {
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
  const { data: allMovieData, isLoading: isAllMoviesLoading } =
    api.movie.getAll.useQuery();
  const { data: moviesByGenre, isLoading: isGenreMoviesLoading } =
    api.movie.getAllFilterByGenre.useQuery({
      genres: [{ genre: { contains: "Action" } }],
    });

  const [movieType, setMovieType] = useState("all");
  const [genres, setGenres] = useState<string[]>(["All"]);
  const [movieData, setMovieData] = useState(allMovieData);

  const filterMovies = () => {
    let result: typeof allMovieData = [];
    if (movieType !== "all") {
      allMovieData?.map((movie) => {
        if (movie.type === movieType) result?.push(movie);
      });
    } else {
      result = allMovieData;
    }

    let tempData: typeof allMovieData = [];
    if (!genres.includes("All")) {
      result?.map((movie) => {
        if (genres.some((element) => movie.genre?.includes(element)))
          tempData?.push(movie);
      });
    } else {
      tempData = result;
    }
    setMovieData(tempData);
    console.log("Both Filters: ", result);
  };

  useEffect(() => {
    filterMovies();
  }, [isAllMoviesLoading]);

  useEffect(() => {
    filterMovies();
  }, [genres, movieType]);

  useEffect(() => {
    window.localStorage.setItem("includeWatched", includeWatched.toString());
  }, [includeWatched]);

  useEffect(() => {
    setIncludeWatched(
      JSON.parse(window.localStorage.getItem("includeWatched")!)
    );
  }, []);

  if (isAllMoviesLoading) return <LoadingPage />;

  if (!allMovieData) return <div>Something went wrong</div>;
  if (allMovieData.length === 0)
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

  const toggleIncludeWatched = () => {
    setIncludeWatched((prev) => !prev);
  };

  const getShortMovieTitle = (title: string) => {
    const maxLength = 20;
    if (title.length > maxLength) return title.substring(0, maxLength) + "..";
    return title;
  };

  return (
    <div className="flex w-full flex-col justify-center sm:px-5 2xl:px-20">
      <div className="mt-2 flex w-full items-center justify-between px-5 lg:justify-start lg:gap-8">
        <FilterBar setMovieType={setMovieType} setGenres={setGenres} />
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            checked={includeWatched}
            type="checkbox"
            value=""
            className="peer sr-only"
            onChange={() => toggleIncludeWatched()}
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {includeWatched ? "Including watched" : "Excluding watched"}
          </span>
        </label>
      </div>
      <div className="flex w-full justify-center">
        <div className="my-2 mx-3 grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {!includeWatched &&
            movieData?.map((movie) =>
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
          {includeWatched &&
            movieData?.map((movie) => (
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
                  <div className="mx-1 mt-2 w-fit text-center text-sm font-bold">
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
    </div>
  );
};
