import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PostFeed } from "~/components/PostFeed";
import { Navbar } from "~/components/navbar";
import { api } from "~/utils/api";

const Posts: NextPage = () => {
  const { data: sessionData } = useSession();
  const [postContent, setPostContent] = useState("");
  const [refreshPosts, setRefreshPosts] = useState(false);
  const { mutate: createPost, error: errorCreatingPost } =
    api.post.create.useMutation({
      onSuccess: () => {
        setPostContent("");
        setRefreshPosts((prev) => !prev);
        toast.success("Created new post");
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to post. Please try again.");
        }
      },
    });

  useEffect(() => {
    //const { data } = api.post.getAll.useQuery();
    setRefreshPosts(false);
  }, [refreshPosts]);

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
        <div className="m-3 rounded-lg border-4 border-slate-200 bg-gray-900 p-2">
          <form
            className="flex flex-col items-center justify-center gap-2 p-2"
            onSubmit={(e) => {
              e.preventDefault();
              createPost({
                userId: sessionData.user.id,
                content: postContent,
              });
            }}
          >
            <div className="flex w-full flex-col">
              <div className="my-1 flex items-center justify-center"></div>
              <textarea
                id="review"
                name="review"
                className="row-span-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>
            <button
              className="m-2 w-fit rounded-lg border-2 bg-gray-600 px-3 py-1 text-lg"
              type="submit"
            >
              POST
            </button>
          </form>
        </div>
        {!refreshPosts && <PostFeed />}
      </main>
    </>
  );
};

export default Posts;
