"use client";

import Image from "next/image";
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
  user: User;
  title: string;
  content: string;
  slug: string;
}

export default function ViewUser({ params }: { params: { slug: string } }) {
  const [user, setUser] = useState<User>(null!);

  useEffect(() => {
    fetch(`/api/profile?user=${params.slug}`)
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, [params.slug]);

  const truncate = (str: string): string => {
    return str.length > 100 ? str.slice(0, 97) + "..." : str;
  };

  return (
    <>
      {user && (
        <div className="flex flex-col p-4 bg-slate-100 min-h-screen w-full text-black">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2"></div>
            <div className="col-span-5 flex flex-col justify-items-center content-center justify-center  divide-y">
              <p className="font-bold text-4xl">Stories</p>
              {user.posts.map((post) => (
                <div key={post.id} className="flex flex-col">
                  <p className="font-bold text-xl">{post.title}</p>
                  <p className="text-lg">{truncate(post.content)}</p>
                </div>
              ))}
            </div>
            <div className="col-span-3 flex flex-col w-full justify-center items-center">
              <Image
                src={`/avatars/${user.avatar}`}
                alt={user.username}
                height={100}
                width={100}
                className="rounded-full"
              />
              <p className="font-bold text-xl">{user.username}</p>
              <p className="text-lg break-all">{user.description}</p>
            </div>
            <div className="col-span-2"></div>
          </div>
        </div>
      )}
    </>
  );
}
