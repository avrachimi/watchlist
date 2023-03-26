import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import thumbnail from "~/thumbnail.jpg";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import { api } from "~/utils/api";
import { Navbar } from "~/components/navbar";
import Image from "next/image";

const ItemGrid = () => {
  return (
    <div className="grid gap-4 px-2 pt-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Item
        title="Breaking Bad"
        imageUrl="https://cdn10.phillymag.com/wp-content/uploads/2013/10/Breaking-Bad-940.jpg"
      />
      <Item
        title="The Last of Us"
        imageUrl="https://i0.wp.com/bloody-disgusting.com/wp-content/uploads/2022/11/last-of-us-tv-2.png"
      />
      <Item
        title="South Park"
        imageUrl="https://townsquare.media/site/1096/files/2018/06/SouthPark-header.jpg"
      />
      <Item
        title="You"
        imageUrl="https://mattsviews.files.wordpress.com/2020/07/you-poster-netflix.jpg"
      />
    </div>
  );
};

interface Props {
  title: string;
  imageUrl: string;
}

const Item = ({ title, imageUrl }: Props) => {
  return (
    <div className="mx-2 flex h-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-slate-200">
      <div className="h-full w-full border">
        <img src={imageUrl} className="h-full w-full object-cover" />
      </div>
      <div className="mt-2 text-center text-xl">{title}</div>
      <div className="grid w-full grid-cols-2 items-end  px-2 py-2">
        <div className="flex scale-90">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiOutlineStar />
        </div>
        <div className="text-right text-xs">
          <div>watched by</div>
          <div>5 friends</div>
        </div>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
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
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-900">
        <Navbar />
        <ItemGrid />
        <div className="flex items-center justify-center">
          <button
            className="my-5 rounded-lg border-2 border-slate-400 py-2 px-3 hover:bg-slate-700"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;
