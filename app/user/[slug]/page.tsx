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
  user: User;
  title: string;
  content: string;
}

export default function ViewUser({ params }: { params: { slug: string } }) {
  const [user, setUser] = useState<User>(null!);

  useEffect(() => {
    fetch(`/api/profile?user=${params.slug}`)
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, [params.slug]);

  return (
    <>
      {user && (
        <div className="flex flex-col p-4 items-center content-start bg-slate-100 min-h-screen w-full text-black">
          {user.description}
        </div>
      )}
    </>
  );
}
