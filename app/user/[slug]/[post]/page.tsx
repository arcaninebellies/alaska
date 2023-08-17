"use client";

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

export default function ViewPost({
  params,
}: {
  params: { slug: string; post: string };
}) {
  const [post, setPost] = useState<Post>(null!);

  useEffect(() => {
    fetch(`/api/post?user=${params.slug}&slug=${params.post}`)
      .then((res) => res.json())
      .then((data) => setPost(data.post));
  }, []);

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
