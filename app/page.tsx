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
      {session ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  );
}
