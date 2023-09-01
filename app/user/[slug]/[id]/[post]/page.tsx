"use client";

import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { headers } from "next/headers";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
interface User {
  id: number;
  username: string;
  avatar: string;
  description: string;
  posts: Post[];
  email: string;
}

interface Post {
  id: number;
  createdAt: Date;
  user: User;
  title: string;
  content: string;
  slug: string;
  comments: Comment[];
}

interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  user: User;
  post: Post;
}
export default function ViewPost({
  params,
}: {
  params: { slug: string; id: string; post: string };
}) {
  const [post, setPost] = useState<Post>(null!);
  const [open, setOpen] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();
  dayjs.extend(relativeTime);

  useEffect(() => {
    fetch(`/api/post?user=${params.slug}&slug=${params.post}&id=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data.post);
      });
  }, [params.slug, params.post, params.id]);
  const deletePost = () => {
    fetch(`/api/post/edit`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: post.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          router.push(`/user/${post.user.username}`);
        }
      });
  };

  const makeComment = () => {
    fetch("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: post.id,
        content: comment,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPost({ ...post, comments: post.comments.concat(data.comment) });
      });
  };
  return (
    <>
      {post && (
        <>
          <div className="flex flex-col p-4 items-center justify-start content-start bg-slate-100 min-h-screen w-full text-black">
            <p className="text-4xl font-bold">{post.title}</p>
            {session && session.user.email === post.user.email && (
              <div className="flex flex-row">
                <Link href={`/post/edit/${post.id}/`}>
                  <button className="bg-emerald-400/75 rounded-lg px-4 text-slate-100 hover:bg-emerald-400 mr-1">
                    Edit
                  </button>
                </Link>
                <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                  <DialogTrigger asChild>
                    <button className="bg-rose-400/75 rounded-lg px-4 text-slate-100 hover:bg-rose-400 ml-1">
                      Delete
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-2 border-rose-400">
                    Are you sure you want to delete this?
                    <button
                      onClick={() => deletePost()}
                      className="bg-rose-400/75 rounded-lg px-4 text-slate-100 hover:bg-rose-400 ml-1"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="bg-emerald-400/75 rounded-lg px-4 text-slate-100 hover:bg-emerald-400 ml-1"
                    >
                      No
                    </button>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            <p className="text-lg">{post.content}</p>
            <div className="mt-24 divide-y">
              {post.comments.map((comment) => (
                <div key={comment.id} className="p-4">
                  <div className="h-full w-full items-center grid grid-cols-12">
                    <div className="flex flex-col col-span-1 justify-center items-center">
                      <Image
                        src={`/avatars/${comment.user.avatar}`}
                        alt={comment.user.username}
                        width={50}
                        height={50}
                        className="rounded-full mr-4"
                      />
                    </div>
                    <div className="flex flex-col col-span-11">
                      <div className="flex flex-row items-center">
                        <p className="mr-1">{comment.user.username}</p>
                        <p className="text-sm text-slate-400">
                          {dayjs().to(dayjs(new Date(comment.createdAt)))}
                        </p>
                      </div>
                      <p> {comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Textarea
                placeholder="New Comment...."
                className="mt-24"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={() => makeComment()}
                className="bg-emerald-400/75 rounded-lg p-4 text-slate-100 hover:bg-emerald-400"
              >
                Comment
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
