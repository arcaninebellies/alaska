"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import bg from "../public/mckayla-crump-3OR-XFzKSBo-unsplash.jpg";
export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center  justify-center ">
      <Image
        src={bg}
        placeholder="blur"
        quality={100}
        fill
        sizes="100vw"
        alt="alaska bg"
        className="object-cover grayscale"
      />
      <div className="z-10 flex flex-col items-center justify-center">
        <p className="text-7xl text-transparent bg-gradient-to-r from-sky-500 to-slate-900 bg-clip-text">
          alaska
        </p>
        {!session ? (
          <button
            className="bg-sky-500/50 p-4 rounded-lg text-white"
            onClick={() => signIn()}
          >
            Sign In
          </button>
        ) : (
          <button
            className="bg-sky-500/50 p-4 rounded-lg text-white"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        )}
      </div>
    </main>
  );
}
