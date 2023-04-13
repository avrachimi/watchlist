import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "./loading";
import ErrorComponent from "./ErrorComponent";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import placeholderProfilePic from "../../public/profile.jpg";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

dayjs.extend(relativeTime);

const Comments = ({ postId }: { postId: string }) => {
  const { data: comments, isLoading: commentsLoading } =
    api.postComment.getLatestCommentsbyPostId.useQuery({
      postId: postId,
      amount: 3,
    });

  return (
    <div>
      {comments && comments.length > 0 ? (
        <div className="my-1 flex h-full flex-col gap-2.5">
          {comments
            .slice(0)
            .reverse()
            .map((comment) => (
              <div className="w-full text-xs text-gray-400" key={comment.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-1 flex w-5 items-center justify-center">
                      <img
                        className="rounded-full border-gray-400"
                        src={comment.user.image ?? placeholderProfilePic.src}
                        alt="Profile Pic"
                      />
                    </div>
                    <Link href={`/profile/${comment.userId}`}>
                      <div>{comment.user.name}</div>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>{dayjs(comment.createdAt).fromNow()}</div>
                  </div>
                </div>
                <div className="ml-6 mr-2">{comment.content}</div>
              </div>
            ))}
        </div>
      ) : comments?.length === 0 ? null : (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

const PostBlock = ({ postId, userId }: { postId: string; userId: string }) => {
  const { data: sessionData } = useSession();
  const { data: post, isLoading: postLoading } = api.post.getById.useQuery({
    id: postId,
  });
  const { data: like, isLoading: likeLoading } =
    api.postLike.getByPostIdAndUserId.useQuery({
      postId: postId,
      userId: userId,
    });

  const [refreshLikes, setRefreshLikes] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const { mutate: createLike, isLoading: isLiking } =
    api.postLike.create.useMutation({
      onSuccess: () => {
        setRefreshLikes(false);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        toast.success("Liked post");
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to like post. Please try again.");
        }
      },
    });
  const { mutate: deleteLike, isLoading: isDeletingLike } =
    api.postLike.delete.useMutation({
      onSuccess: () => {
        setRefreshLikes(false);
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
        toast.success("Removed like from post");
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to like post. Please try again.");
        }
      },
    });

  const [refreshComments, setRefreshComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentCount, setCommentCount] = useState(0);

  const {
    mutate: createComment,
    error: errorCreatingComment,
    isLoading: isCommenting,
  } = api.postComment.create.useMutation({
    onSuccess: () => {
      setRefreshComments(false);
      setCommentCount((prev) => prev + 1);
      setCommentContent("");
      toast.success("Commented on post");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to comment on post. Please try again.");
      }
    },
  });

  useEffect(() => {
    setLikeCount(post?.PostLike.length ?? 0);
    setCommentCount(post?.PostComment.length ?? 0);
    let temp = false;
    post?.PostLike.map((like) => {
      if (like.userId === sessionData?.user.id) temp = true;
    });
    setIsLiked(temp);
  }, [postLoading]);

  if (postLoading || likeLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (!post) return null;

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

  const toggleLike = () => {
    if (isLiked) {
      deleteLike({
        id: like?.id ?? "",
      });
    } else {
      if (sessionData)
        createLike({
          userId: sessionData.user.id,
          postId: postId,
        });
      setRefreshLikes(true);
    }
    console.log("toggle like");
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div
        key={post.id}
        className="my-2 flex w-full flex-col justify-center rounded-md border-2 border-gray-400 p-3"
      >
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
        </div>
        <Link href={`/posts/${post.id}`}>
          <div className="text-md my-2 mx-2">{post.content}</div>
        </Link>
        <div className="flex w-full items-center justify-between justify-self-start px-2 pb-2 text-xs">
          <div className="text-gray-400">{dayjs(post.createdAt).fromNow()}</div>

          {!refreshLikes && (
            <div className="flex items-center text-xs">
              <Link href={`/posts/${post.id}`}>
                {commentCount} comments • {likeCount} likes
              </Link>
              <div className="ml-3 cursor-pointer" onClick={() => toggleLike()}>
                {isLiked && <AiFillHeart size={22} />}
                {!isLiked && <AiOutlineHeart size={22} />}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center border-slate-200 bg-gray-900">
          {commentCount > 0 && <div className=" mb-2 border-t-2"></div>}
          {commentCount > 3 && (
            <div className="flex cursor-pointer items-center justify-center text-xs text-blue-400 underline ">
              <Link href={`/posts/${post.id}`}>view older comments...</Link>
            </div>
          )}
          {!refreshComments && <Comments postId={postId} />}
          <div className="mt-1 border-t border-slate-400 bg-gray-900 p-2">
            <div className="flex w-full flex-col">
              <input
                placeholder="Comment something..."
                className="grow bg-transparent text-sm outline-none placeholder:text-gray-400"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (commentContent !== "") {
                      if (sessionData)
                        createComment({
                          userId: sessionData.user.id,
                          postId: post.id,
                          content: commentContent,
                        });
                      setRefreshComments(true);
                    }
                  }
                }}
                disabled={isCommenting}
              />
              {commentContent !== "" && !isCommenting && (
                <div className="flex w-full justify-center">
                  <button
                    className="w-fit rounded-md border-2 px-2"
                    onClick={() => {
                      createComment({
                        userId: sessionData.user.id,
                        postId: post.id,
                        content: commentContent,
                      });
                      setRefreshComments(true);
                    }}
                    disabled={isCommenting}
                  >
                    Comment
                  </button>
                </div>
              )}
              {isCommenting && (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size={20} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const PostFeed = () => {
  const { data: sessionData } = useSession();
  const { data: dbPosts, isLoading: postsLoading } = api.post.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (dbPosts?.length === 0) return <div>No Posts yet</div>;

  if (!dbPosts)
    return (
      <ErrorComponent
        name="Error"
        details="Couldn't load posts. Try again by refreshing the page."
      />
    );

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
    <div className="flex w-full flex-col justify-center sm:px-5 2xl:px-20">
      <div className="flex w-full justify-center">
        <div className="my-2 mx-3 w-full">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full">
              {dbPosts ? (
                dbPosts.map((post) => (
                  <PostBlock
                    postId={post.id}
                    userId={post.userId}
                    key={post.id}
                  />
                ))
              ) : (
                <div>No Posts</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
