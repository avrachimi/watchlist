import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Navbar } from "~/components/navbar";
import { Feed } from "~/components/Feed";
import { useState } from "react";

const DropdownGenre = () => {
  const items = [
    "All",
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drame",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Musical",
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
        setOptions([]);
      } else {
        const index = options.indexOf(item);
        let tempArray = options.slice();
        tempArray.splice(index, 1);
        setOptions(tempArray);
      }
    } else {
      if (item === "All") {
        setOptions(items);
      } else {
        setOptions((prev) => [...prev, item]);
      }
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

const FilterBar = () => {
  return (
    <div className=" my-2 flex w-full justify-start px-3">
      <DropdownGenre />
    </div>
  );
};

const Home = () => {
  const { data: sessionData } = useSession();

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

  return (
    <>
      <Head>
        <title>Watchlist</title>
        <meta name="description" content="Movie and tv show recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-w-screen min-h-screen bg-gray-900 pb-5">
        <Navbar />
        <FilterBar />
        <Feed />
      </main>
    </>
  );
};

export default Home;
