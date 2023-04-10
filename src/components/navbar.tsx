import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import logo from "~/logo.svg";

interface Props {
  query?: string;
}

export const Navbar = ({ query = "" }: Props) => {
  const { data: sessionData } = useSession();
  const [searchQuery, setSearchQuery] = useState(query);
  const [toggleMobileNavbar, setMobileNavbar] = useState(false);

  return (
    <div className="flex items-center justify-between bg-slate-600 py-2 px-4">
      <div className="">
        <Link href={"/"}>
          <Image src={logo} width={24} height={24} alt="Logo" />
        </Link>
      </div>
      <form className="w-4/6" action={`/search/${searchQuery}`}>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-slate-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full rounded-lg border border-slate-300 bg-slate-500 p-2.5 pl-10 text-sm text-slate-50"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
          <button
            type="submit"
            className="absolute right-2 bottom-2 hidden rounded-lg bg-slate-700 px-4 py-1 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 md:block"
          >
            Search
          </button>
        </div>
      </form>
      <div className="">
        {toggleMobileNavbar && (
          <div className="absolute top-0 right-0 z-10 h-full w-[50%] bg-gray-600">
            <div className="flex w-full flex-col items-center justify-center p-2">
              <div className="flex w-full items-center justify-start p-2">
                <AiOutlineClose
                  size={25}
                  className="cursor-pointer xl:hidden"
                  onClick={() => setMobileNavbar((prev) => !prev)}
                />
              </div>
              <div className="w-full text-right text-xl">
                <ul className="mr-2 flex flex-col gap-2">
                  <li>
                    <Link href={`/`}>Home</Link>
                  </li>
                  <li>
                    <Link href={`/`}>Watchlist</Link>
                  </li>
                  <li>
                    <Link href={`/`}>Friends</Link>
                  </li>
                  <li>
                    <Link href={`/profile`}>Profile</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        <AiOutlineMenu
          size={22}
          className="cursor-pointer xl:hidden"
          onClick={() => setMobileNavbar((prev) => !prev)}
        />
        <div className="hidden xl:block">
          <Link href={"/"} className="px-2">
            Home
          </Link>
          <Link href={"/account"} className="px-4">
            {/* <Image
              src={sessionData?.user.image ?? ""}
              className="rounded border"
              width={56}
              height={56}
              alt="Account"
            /> */}
            Account
          </Link>
        </div>
      </div>
    </div>
  );
};
