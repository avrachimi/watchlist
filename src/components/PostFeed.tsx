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

dayjs.extend(relativeTime);

export const PostFeed = () => {
  const { data: sessionData } = useSession();
  const { data: dbPosts, isLoading: postsLoading } = api.post.getAll.useQuery();

  const [posts, setPosts] = useState<typeof dbPosts>(undefined);
  const [postLikes, setPostLikes] = useState<string[]>([]);

  useEffect(() => {
    if (dbPosts) setPosts(dbPosts);

    dbPosts?.map((post) => {
      post.PostLike.map((like) => {
        if (like.userId === sessionData?.user.id)
          setPostLikes((prev) => [...prev, post.id]);
      });
    });
  }, [postsLoading]);

  if (postsLoading) return <LoadingPage />;

  if (dbPosts?.length === 0) return <div>No Posts yet</div>;

  if (!dbPosts)
    return (
      <ErrorComponent
        name="Error"
        details="Couldn't load posts. Try again by refreshing the page."
      />
    );

  const PostBlock = ({ postId }: { postId: string }) => {
    const { data: post, isLoading: postLoading } = api.post.getById.useQuery({
      id: postId,
    });
    const { data: comments, isLoading: commentsLoading } =
      api.postComment.getLatestCommentsbyPostId.useQuery({
        postId: postId,
        amount: 3,
      });

    if (postsLoading)
      return (
        <div className="flex h-full w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      );

    if (!post) return null;

    const commentCount = post.PostComment.length;
    return (
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
          {/* <div className="flex items-center justify-center">Delete</div> */}
        </div>
        <Link href={`/posts/${post.id}`}>
          <div className="text-md my-2 mx-2">{post.content}</div>
        </Link>
        <div className="flex w-full items-center justify-between justify-self-start pb-2 text-xs">
          <div className="text-gray-400">{dayjs(post.createdAt).fromNow()}</div>
          <div className="flex items-center text-xs">
            <div>
              {post.PostComment.length} comments • {post.PostLike.length} likes
            </div>
            <div
              className="ml-3 cursor-pointer"
              onClick={() => toggleLike(post.id)}
            >
              {postLikes.includes(post.id) && <AiFillHeart size={20} />}
              {!postLikes.includes(post.id) && <AiOutlineHeart size={20} />}
            </div>
          </div>
        </div>
        {comments && comments.length > 0 ? (
          <div className="border-t pt-2">
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
            {commentCount > comments.length && (
              <div className="flex cursor-pointer items-center justify-center text-xs text-blue-400 underline">
                <Link href={`/posts/${post.id}`}>More comments...</Link>
              </div>
            )}
          </div>
        ) : comments?.length === 0 ? null : (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
    );
  };

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
    if (postLikes.includes(postId)) {
      let tempArray = postLikes;
      const index = postLikes.indexOf(postId);
      tempArray.splice(index, 1);
      postLikes.length !== 1 ? setPostLikes(tempArray) : setPostLikes([]);
    } else {
      setPostLikes((prev) => [...prev, postId]);
    }
    console.log(postLikes);
  };

  return (
    <div className="flex w-full flex-col justify-center sm:px-5 2xl:px-20">
      <div className="flex w-full justify-center">
        <div className="my-2 mx-3 w-full">
          <div className="flex flex-col items-center justify-center">
            <div className="my-3 flex w-full justify-start border-b text-xl">
              Posts
            </div>
            <div className="w-full">
              {posts ? (
                posts.map((post) => <PostBlock postId={post.id} />)
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
