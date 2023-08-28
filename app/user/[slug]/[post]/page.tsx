import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  avatar: string;
  description: string;
  posts: Post[];
}

interface Post {
  id: number;
  createdAt: Date;
  user: User;
  title: string;
  content: string;
  slug: string;
}
async function getData(slug, post) {
  const res = await fetch(
    `${process.env.NEXT_URL}/api/post?user=${slug}&slug=${post}`,
  );
  const data = await res.json();
  return data.post;
}
export default async function ViewPost({
  params,
}: {
  params: { slug: string; post: string };
}) {
  const post = await getData(params.slug, params.post);

  return (
    <>
      {post && (
        <>
          <div className="flex flex-col p-4 items-center justify-start content-start bg-slate-100 min-h-screen w-full text-black">
            <p className="text-4xl font-bold">{post.title}</p>
            <p className="text-lg">{post.content}</p>
          </div>
        </>
      )}
    </>
  );
}
