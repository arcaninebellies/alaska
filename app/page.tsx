"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
      <p className="text-7xl text-transparent bg-gradient-to-r from-sky-500 to-slate-900 bg-clip-text">
        alaska
      </p>
      {!session && (
        <button
          className="bg-sky-500/50 p-4 rounded-lg text-white"
          onClick={() => signIn()}
        >
          Sign In
        </button>
      )}
    </div>
  );
}
