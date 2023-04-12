import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import ErrorComponent from "./ErrorComponent";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import placeholderProfilePic from "../../public/profile.jpg";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

export const PostFeed = () => {
  const { data: sessionData } = useSession();
  const { data: dbPosts, isLoading: postsLoading } = api.post.getAll.useQuery();

  const [posts, setPosts] = useState<typeof dbPosts>(undefined);
  const [postLikes, setPostLikes] = useState<string[]>([]);

  useEffect(() => {
    if (dbPosts) setPosts(dbPosts);
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
            {posts ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="my-2 flex w-full flex-col justify-center rounded-md border-2 border-gray-400 p-5"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 items-center justify-center">
                        <img
                          className="rounded-full border-2 border-gray-400"
                          src={post.user.image ?? placeholderProfilePic.src}
                          alt="Profile Pic"
                        />
                      </div>
                      <div className="mx-2 text-xl">{post.user.name}</div>
                    </div>
                    {/* <div className="flex items-center justify-center">Delete</div> */}
                  </div>
                  <div className="my-4 mx-2 text-lg">{post.content}</div>
                  <div className="flex w-full items-center justify-between justify-self-start text-sm">
                    <div className="text-gray-400">
                      {dayjs(post.createdAt).fromNow()}
                    </div>
                    <div className="flex items-center text-xs">
                      <div>
                        {post.PostComment.length} comments •{" "}
                        {post.PostLike.length} likes
                      </div>
                      <div
                        className="ml-3 cursor-pointer"
                        onClick={() => toggleLike(post.id)}
                      >
                        {postLikes.includes(post.id) && (
                          <AiFillHeart size={20} />
                        )}
                        {!postLikes.includes(post.id) && (
                          <AiOutlineHeart size={20} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No Posts</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
