"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import sanitizeHtml from "sanitize-html";

type User = {
  id: number;
  username: string;
  avatar: string;
  description: string;
  posts: Post[];
};

type Post = {
  id: number;
  user: User;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
};

export default function Search() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const search = searchParams.get("params");
  useEffect(() => {
    fetch(`/api/search?params=${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts));
  }, []);

  const truncate = (str: string): string => {
    return str.length > 100 ? str.slice(0, 97) + "..." : str;
  };

  return (
    <>
      {posts && (
        <div className="flex flex-col p-24 justify-start content-start bg-slate-100 min-h-screen w-full text-black ">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col">
              <Link
                href={`/user/${post.user.username}/${post.id}/${post.slug}`}
              >
                <div className="flex flex-row justify-between items-center">
                  <p className="font-bold text-xl">{post.title}</p>
                  <p className="text-sm text-slate-400">
                    Published {dayjs(post.createdAt).format("YYYY-MM-DD")}
                  </p>
                </div>
                <div
                  className="text-lg"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(truncate(post.content)),
                  }}
                ></div>{" "}
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
