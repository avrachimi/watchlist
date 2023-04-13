import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PostFeed } from "~/components/PostFeed";
import { Navbar } from "~/components/navbar";
import { api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage } from "~/components/loading";
import ErrorPage from "~/components/ErrorPage";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import placeholderProfilePic from "../../../public/profile.jpg";
import Link from "next/link";

dayjs.extend(relativeTime);

function SinglePost() {
  const { data: sessionData } = useSession();
  const { mutate: createComment, error: errorCreatingComment } =
    api.postComment.create.useMutation();
  const router = useRouter();
  let { id } = router.query;
  id = typeof id === "string" ? id : "";
  const { data: post, isLoading: isPostLoading } = api.post.getById.useQuery({
    id: id,
  });
  const { data: comments, isLoading: commentsLoading } =
    api.postComment.getAllByPostId.useQuery({
      postId: id,
    });
  const [commentContent, setCommentContent] = useState("");

  if (isPostLoading) return <LoadingPage />;

  if (!post)
    return <ErrorPage name="Error" details="Couldn't find post. Try again." />;

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

  const toggleLike = (postId: string) => {
    console.log("like");
  };

  return (
    <>
      <Head>
        <title>Watchlist</title>
        <meta name="description" content="Movie and tv show recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-w-screen min-h-screen bg-gray-900 pb-5">
        <Navbar />
        <div className="flex flex-col justify-center p-2 px-5">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <div className="w-7 items-center justify-center">
                <img
                  className="rounded-full border-2 border-gray-400"
                  src={post.user.image ?? placeholderProfilePic.src}
                  alt="Profile Pic"
                />
              </div>
              <Link href={`/profile/${post.user.id}`}>
                <div className="text-md mx-2">{post.user.name}</div>
              </Link>
            </div>
            {/* <div className="flex items-center justify-center">Delete</div> */}
          </div>
          <Link href={`/posts/${post.id}`}>
            <div className="text-md my-2 mx-2">{post.content}</div>
          </Link>
          <div className="flex w-full items-center justify-between justify-self-start pb-2 text-xs">
            <div className="text-gray-400">
              {dayjs(post.createdAt).fromNow()}
            </div>
            <div className="flex items-center text-xs">
              <div>
                {post.PostComment.length} comments • {post.PostLike.length}{" "}
                likes
              </div>
              <div
                className="ml-3 cursor-pointer"
                onClick={() => toggleLike(post.id)}
              ></div>
            </div>
          </div>
        </div>
        {comments && comments.length > 0 ? (
          <div className="mx-5 border-t pt-2">
            {comments.map((comment) => (
              <div className="my-2 flex w-full flex-col text-xs text-gray-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="m-1 ml-0 flex w-5 items-center justify-center">
                      <img
                        className="rounded-full border-gray-400"
                        src={comment.user.image ?? placeholderProfilePic.src}
                        alt="Profile Pic"
                      />
                    </div>
                    <div>{comment.user.name}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>{dayjs(comment.createdAt).fromNow()}</div>
                  </div>
                </div>
                <div className="ml-6 mr-2">{comment.content}</div>
              </div>
            ))}
          </div>
        ) : null}
        <div className="m-3 mt-10 rounded-lg border-4 border-slate-200 bg-gray-900 p-2">
          <form
            className="flex flex-col items-center justify-center gap-2 p-2"
            onSubmit={(e) => {
              e.preventDefault();

              createComment({
                content: commentContent,
                userId: sessionData.user.id,
                postId: typeof id === "string" ? id : "",
              });

              if (!errorCreatingComment) {
                setCommentContent("");
              }
            }}
          >
            <div className="flex w-full flex-col">
              <div className="my-1 flex items-center justify-center"></div>
              <textarea
                id="comment"
                name="comment"
                className="row-span-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>
            <button
              className="m-2 w-fit rounded-lg border-2 bg-gray-600 px-3 py-1 text-lg"
              type="submit"
            >
              Comment
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default SinglePost;
