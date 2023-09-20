"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  avatar: string;
}

export default function Navbar() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>(null!);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && search !== "") {
      return router.push(`/search?params=${search}`);
    }
  };

  useEffect(() => {
    if (session) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => setUser(data.user));
    }
  }, [session]);

  return (
    <>
      <div className="backdrop-filter backdrop-blur bg-opacity-25 flex z-10 flex-row bg-slate-100 shadow text-black p-4 justify-end w-full absolute top-0">
        <>
          <Input
            className="w-2/6 mr-32"
            placeholder="Search"
            onKeyDown={handleSearch}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {user && (
            <div className="flex flex-row">
              <div onClick={() => signOut()}>
                <div className="flex flex-row justify-center items-center content-center mr-4 cursor-pointer">
                  <p className="text-lg">Sign Out</p>
                </div>
              </div>
              <Link href="/user/settings">
                <div className="flex flex-row justify-center items-center content-center mr-4 cursor-pointer">
                  <p className="text-lg">Settings</p>
                </div>
              </Link>
              <Link href="/post/new">
                <div className="flex flex-row justify-center items-center content-center mr-4">
                  <p className="text-lg">Write</p>
                </div>
              </Link>
              <Link href="/user/articles">
                <div className="flex flex-row justify-center items-center content-center mr-4">
                  <p className="text-lg">Articles</p>
                </div>
              </Link>
              <Link href={`/user/${user.username}`}>
                <div className="flex flex-row justify-center items-center">
                  <Image
                    src={`https://cdn.notblizzard.dev/alaska/avatars/${user.avatar}.png`}
                    alt={user.username}
                    height={30}
                    width={30}
                    className="rounded-full"
                  />
                </div>
              </Link>
            </div>
          )}
        </>
      </div>
    </>
  );
}
