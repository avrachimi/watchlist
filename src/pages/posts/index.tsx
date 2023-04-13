import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PostFeed } from "~/components/PostFeed";
import { LoadingSpinner } from "~/components/loading";
import { Navbar } from "~/components/navbar";
import { api } from "~/utils/api";

const Posts = () => {
  const { data: sessionData } = useSession();
  const [postContent, setPostContent] = useState("");
  const [refreshPosts, setRefreshPosts] = useState(false);
  const {
    mutate: createPost,
    error: errorCreatingPost,
    isLoading: isPosting,
  } = api.post.create.useMutation({
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
          className="rounded-xl bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white"
          onClick={() => void signIn()}
        >
          Sign in
        </button>
      </div>
    );
  }
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Head>
        <title>Watchlist</title>
        <meta name="description" content="Movie and tv show recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-w-screen min-h-screen bg-gray-900 pb-5">
        <Navbar />
        <div className="">
          <div className="m-3 border-b-2 border-slate-200 bg-gray-900 p-2">
            <div className="flex w-full flex-col">
              <div className="my-1 flex items-center justify-center"></div>
              <textarea
                placeholder="Type something to post..."
                className="mb-1 h-8 grow bg-transparent outline-none duration-200 ease-in focus:h-32"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (postContent !== "") {
                      createPost({
                        userId: sessionData.user.id,
                        content: postContent,
                      });
                    }
                  }
                }}
                disabled={isPosting}
              />
              {postContent !== "" && !isPosting && (
                <div className="flex w-full justify-center">
                  <button
                    className="w-fit rounded-md border-2 px-2"
                    onClick={() =>
                      createPost({
                        userId: sessionData.user.id,
                        content: postContent,
                      })
                    }
                    disabled={isPosting}
                  >
                    Post
                  </button>
                </div>
              )}
              {isPosting && (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size={20} />
                </div>
              )}
            </div>
          </div>
        </div>
        {!refreshPosts && <PostFeed />}
      </main>
    </>
  );
};

export default Posts;
