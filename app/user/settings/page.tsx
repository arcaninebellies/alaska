"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  avatar: string;
  description: string;
}

export default function Settings() {
  const [user, setUser] = useState<User>(null!);

  useEffect(() => {
    fetch("/api/user/")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      });
  }, []);

  const submit = () => {
    fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  };

  return (
    <>
      {user && (
        <div className="flex flex-col p-4 items-center justify-start content-start bg-slate-100 min-h-screen w-full text-black">
          <p className="text-2xl">Update Settings</p>
          <input
            name="username"
            id="username"
            className="border-transparent focus:border-transparent focus:outline-none text-4xl w-4/6 bg-slate-100"
            size={50}
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />{" "}
          <textarea
            className="resize-none border-transparent mt-4 focus:border-transparent focus:outline-none text-4xl w-4/6 bg-slate-100"
            rows={10}
            value={user.description}
            placeholder="Description"
            onChange={(e) => setUser({ ...user, description: e.target.value })}
          />
          <button
            onClick={() => submit()}
            className="bg-emerald-400/75 rounded-lg p-4 text-slate-100 hover:bg-emerald-400 mr-4"
          >
            Save
          </button>
        </div>
      )}
    </>
  );
}
