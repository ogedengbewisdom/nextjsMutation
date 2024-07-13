"use client";
import { useOptimistic } from "react";
import { formatDate } from "@/lib/format";
import LikeButton from "./like-icon";
import { togglePostStatus } from "@/lib/post-mutation";
import Image from "next/image";

// import { updatePostLikeStatus } from "@/lib/posts";

const testLoader = (config) => {
  const startUrl = config.src.split("upload/")[0];

  const endUrl = config.src.split("upload/")[1];
  const transformedUrl = `${startUrl}upload/w_200,q_${config.quality}/${endUrl}`;
  return transformedUrl;
};

function Post({ post, action }) {
  // const toggleFunction = () => {
  //   togglePostStatus(post.id);
  // };
  return (
    <article className="post">
      <div className="post-image">
        <Image
          loader={testLoader}
          src={post.image}
          width={200}
          height={120}
          alt={post.title}
          quality={50}
        />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{" "}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <form
              action={action.bind(null, post.id)}
              className={post.isLiked ? "liked" : ""}
            >
              <LikeButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }) {
  const [optimisticPost, updatedOptimisticPost] = useOptimistic(
    posts,
    (prevPost, updatedPostId) => {
      const updatedPostIndex = prevPost.findIndex(
        (post) => post.id === updatedPostId
      );

      if (updatedPostIndex === -1) {
        return prevPost;
      }
      const updatedPost = { ...prevPost[updatedPostIndex] };
      updatedPost.likes = updatedPost.likes + (updatedPost.isLiked ? -1 : 1);
      updatedPost.isLiked = !updatedPost.isLiked;
      const newPost = [...prevPost];
      newPost[updatedPostIndex] = updatedPost;

      return newPost;
    }
  );
  if (!optimisticPost || optimisticPost.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  const updateOptimisticAction = async (postId) => {
    updatedOptimisticPost(postId);
    await togglePostStatus(postId);
  };

  return (
    <ul className="posts">
      {optimisticPost.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updateOptimisticAction} />
        </li>
      ))}
    </ul>
  );
}
