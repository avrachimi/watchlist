import Head from "next/head";
import React from "react";
import { BiError } from "react-icons/bi";
import { Navbar } from "./navbar";

function ErrorPage({ name, details }: { name: string; details: string }) {
  return (
    <>
      <Head>
        <title>Watchlist</title>
        <meta name="description" content="Movie and tv show recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex w-full justify-center">
          <div className="my-16 flex w-4/6 flex-col items-center justify-center text-center">
            <div className="m-2 flex items-center gap-2">
              <BiError className="text-2xl font-bold text-yellow-500" />
              <span className="text-2xl font-bold text-red-700">{name}</span>
              <BiError className="text-2xl font-bold text-yellow-500" />
            </div>
            <div className="m-2 text-lg">{details}</div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ErrorPage;
