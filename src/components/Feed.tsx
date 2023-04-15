import { useSession } from "next-auth/react";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";
import { AiTwotoneEye } from "react-icons/ai";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import ReviewStars from "./ReviewStars";
import { boolean } from "zod";

interface SortObjType {
  by: string;
  asc: boolean;
}

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
  const [options, setOptions] = useState<string[]>(
    JSON.parse(
      window.localStorage.getItem("filterGenres") ?? JSON.stringify(["All"])
    )
  );

  useEffect(() => {
    window.localStorage.setItem("filterGenres", JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    refreshDropdown();
  }, []);

  const refreshDropdown = () => {
    let result = JSON.parse(
      window.localStorage.getItem("filterGenres") ?? JSON.stringify(["All"])
    );
    setOptions(result);

    if (result.includes("All")) {
      setGenres(["All"]);
    } else {
      setGenres(result);
    }
  };

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
  const [options, setOptions] = useState(
    JSON.parse(
      window.localStorage.getItem("filterType") ?? JSON.stringify(items)
    )
  );

  useEffect(() => {
    refreshDropdown();
  }, []);

  const refreshDropdown = () => {
    let result = JSON.parse(
      window.localStorage.getItem("filterType") ?? JSON.stringify(items)
    );
    setOptions(result);

    if (result.length === 2) {
      setMovieType("all");
    } else {
      if (result[0] === "Movies") setMovieType("movie");
      if (result[0] === "Series") setMovieType("series");
    }
  };

  const toggleDropdownItem = (item: string) => {
    if (options.includes(item)) {
      let result = "";
      if (item === "Movies") result = "Series";
      if (item === "Series") result = "Movies";

      setOptions([result]);
      setMovieType(result === "Movies" ? "movie" : "series");
      window.localStorage.setItem("filterType", JSON.stringify([result]));
    } else {
      setOptions(items);
      setMovieType("all");
      window.localStorage.setItem("filterType", JSON.stringify(items));
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

const DropdownTimePeriod = ({
  setTimePeriod,
}: {
  setTimePeriod: React.Dispatch<
    SetStateAction<{
      start: Date;
      end: Date;
    }>
  >;
}) => {
  const items = [
    "All",
    "Last 2 years",
    "2011 - 2020",
    "2001 - 2010",
    "1991 - 2000",
    "Before 1991",
  ];

  useEffect(() => {
    setTimePeriod(
      JSON.parse(
        window.localStorage.getItem("timePeriod") ??
          JSON.stringify({ start: new Date(0), end: new Date() })
      )
    );
  }, []);

  const [showContents, setShowContents] = useState(false);
  const [selected, setSelected] = useState(items[0]);

  const toggleDropdownItem = (item: string) => {
    switch (item) {
      case items[1]:
        var dates = {
          start: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
          end: new Date(),
        };
        setTimePeriod(dates);
        setSelected(items[1]!);
        window.localStorage.setItem("timePeriod", JSON.stringify(dates));
        break;
      case items[2]:
        var dates = {
          start: new Date("1 Jan 2011"),
          end: new Date("31 Dec 2020"),
        };
        setTimePeriod(dates);
        setSelected(items[2]!);
        window.localStorage.setItem("timePeriod", JSON.stringify(dates));
        break;
      case items[3]:
        var dates = {
          start: new Date("1 Jan 2001"),
          end: new Date("31 Dec 2010"),
        };
        setTimePeriod(dates);
        setSelected(items[3]!);
        window.localStorage.setItem("timePeriod", JSON.stringify(dates));
        break;
      case items[4]:
        var dates = {
          start: new Date("1 Jan 1991"),
          end: new Date("31 Dec 2000"),
        };
        setTimePeriod(dates);
        setSelected(items[4]!);
        window.localStorage.setItem("timePeriod", JSON.stringify(dates));
        break;
      case items[5]:
        var dates = {
          start: new Date(0),
          end: new Date("31 Dec 1991"),
        };
        setTimePeriod(dates);
        setSelected(items[5]!);
        window.localStorage.setItem("timePeriod", JSON.stringify(dates));
        break;
      default:
        var dates = {
          start: new Date(0),
          end: new Date(),
        };
        setTimePeriod(dates);
        setSelected(items[0]!);
        window.localStorage.setItem("timePeriod", JSON.stringify(dates));
        break;
    }
    setShowContents((prev) => !prev);
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
        {selected}
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
                  <label
                    onClick={() => toggleDropdownItem(item)}
                    className="ml-2 w-full cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300"
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
  setTimePeriod,
}: {
  setMovieType: React.Dispatch<React.SetStateAction<string>>;
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
  setTimePeriod: React.Dispatch<
    React.SetStateAction<{
      start: Date;
      end: Date;
    }>
  >;
}) => {
  return (
    <div className="my-2 flex w-fit justify-start">
      <DropdownMovieType setMovieType={setMovieType} />
      <DropdownGenre setGenres={setGenres} />
      <DropdownTimePeriod setTimePeriod={setTimePeriod} />
    </div>
  );
};

const DropdownSort = ({
  setSort,
}: {
  setSort: React.Dispatch<
    SetStateAction<{
      by: string;
      asc: boolean;
    }>
  >;
}) => {
  const items = [
    "Recommended",
    "Rating",
    "Release: Most Recent",
    "Release: Oldest",
    "IMDb Rating",
  ];

  const getSelectedTextFromSortObj = ({
    by,
    asc,
  }: {
    by: string;
    asc: boolean;
  }) => {
    switch (by) {
      case "recommended":
        return items[0];
      case "friendRating":
        return items[1];
      case "releaseDate":
        if (!asc) return items[2];
        return items[3];
      case "imdbRating":
        return items[4];
      default:
        return items[0];
    }
  };

  const getSelectedTextFromLocalStorage = () => {
    let obj = JSON.parse(
      window.localStorage.getItem("sortBy") ??
        JSON.stringify({ by: "recommended", asc: false })
    );

    return getSelectedTextFromSortObj(obj);
  };

  useEffect(() => {
    setSort(
      JSON.parse(
        window.localStorage.getItem("sortBy") ??
          JSON.stringify({ by: "recommended", asc: false })
      )
    );
  }, []);

  const [showContents, setShowContents] = useState(false);
  const [selected, setSelected] = useState(getSelectedTextFromLocalStorage());

  const toggleDropdownItem = (item: string) => {
    switch (item) {
      case items[1]:
        setSort({ by: "friendRating", asc: false });
        setSelected(items[1]!);
        window.localStorage.setItem(
          "sortBy",
          JSON.stringify({ by: "friendRating", asc: false })
        );
        break;
      case items[2]:
        setSort({ by: "releaseDate", asc: false });
        setSelected(items[2]!);
        window.localStorage.setItem(
          "sortBy",
          JSON.stringify({ by: "releaseDate", asc: false })
        );
        break;
      case items[3]:
        setSort({ by: "releaseDate", asc: true });
        setSelected(items[3]!);
        window.localStorage.setItem(
          "sortBy",
          JSON.stringify({ by: "releaseDate", asc: true })
        );
        break;
      case items[4]:
        setSort({ by: "imdbRating", asc: false });
        setSelected(items[4]!);
        window.localStorage.setItem(
          "sortBy",
          JSON.stringify({ by: "imdbRating", asc: false })
        );
        break;
      default:
        setSort({ by: "recommended", asc: false });
        setSelected(items[0]!);
        window.localStorage.setItem(
          "sortBy",
          JSON.stringify({ by: "recommended", asc: false })
        );
        break;
    }
    setShowContents((prev) => !prev);
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
        Sort by {selected}
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
                  <label
                    onClick={() => toggleDropdownItem(item)}
                    className="ml-2 w-full cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300"
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

const SortBar = ({
  setSort,
}: {
  setSort: React.Dispatch<
    SetStateAction<{
      by: string;
      asc: boolean;
    }>
  >;
}) => {
  return (
    <div className="my-2 flex w-fit justify-start">
      <DropdownSort setSort={setSort} />
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
  const [sort, setSort] = useState({ by: "recommended", asc: false });
  const [timePeriod, setTimePeriod] = useState({
    start: new Date("1 Jan 2010"),
    end: new Date(),
  });

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
      result = tempData;
    }
    tempData = [];
    result?.map((movie) => {
      if (
        !movie.released ||
        (movie.released >= new Date(timePeriod.start) &&
          movie.released <= new Date(timePeriod.end))
      ) {
        tempData?.push(movie);
      }
    });

    tempData = sortMovies({
      data: tempData,
    });

    setMovieData(tempData);
    console.log("All Filters: ", tempData);
  };

  const sortMovies = ({ data }: { data: typeof allMovieData }) => {
    if (data) {
      let result = data;

      if (sort.by === "releaseDate") {
        result.sort((a, b) =>
          a.released && b.released
            ? new Date(a.released).valueOf() - new Date(b.released).valueOf()
            : 0
        );
      } else if (sort.by === "friendRating") {
        result.sort((a, b) => a.Watched.length - b.Watched.length);
        result.sort(
          (a, b) =>
            Math.round(a.friendRating * 100) / 100 -
            Math.round(b.friendRating * 100) / 100
        );
      } else if (sort.by === "imdbRating") {
        result.sort((a, b) => a.imdbRating - b.imdbRating);
      } else if (sort.by === "recommended") {
        //result.sort((a, b) => a.Watched.length - b.Watched.length);
        result.sort(
          (a, b) =>
            Math.round((a.friendRating + a.Watched.length) * 100) / 100 -
            Math.round((b.friendRating + b.Watched.length) * 100) / 100
        );
      }

      if (!sort.asc) result.reverse();
      return result;
    }
    return data;
  };

  useEffect(() => {
    filterMovies();
  }, [isAllMoviesLoading]);

  useEffect(() => {
    filterMovies();
  }, [genres, movieType, sort, timePeriod]);

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
        <div className="flex w-full flex-col">
          <FilterBar
            setMovieType={setMovieType}
            setGenres={setGenres}
            setTimePeriod={setTimePeriod}
          />
          <SortBar setSort={setSort} />
        </div>
        <label className="relative inline-flex w-72 cursor-pointer flex-col items-center">
          <div>
            <input
              checked={includeWatched}
              type="checkbox"
              value=""
              className="peer sr-only"
              onChange={() => toggleIncludeWatched()}
            />
            <div className="after:left-18 peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          </div>
          <span className="mt-1 text-center text-sm font-medium text-gray-900 dark:text-gray-300">
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
