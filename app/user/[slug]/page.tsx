import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
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

async function getData(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_URL}/api/profile?username=${slug}`,
  );
  const data = await res.json();
  return data.user;
}
export default async function ViewUser({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getData(params.slug);

  const truncate = (str: string): string => {
    return str.length > 100 ? str.slice(0, 97) + "..." : str;
  };

  return (
    <>
      {user && (
        <div className="flex flex-col p-4 bg-slate-100 w-full text-black">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2"></div>
            <div className="col-span-5 flex flex-col content-start justify-start  divide-y h-full">
              <p className="font-bold text-4xl">Stories</p>
              {user.posts.map((post) => (
                <div key={post.id} className="flex flex-col">
                  <Link href={`/user/${user.username}/${post.slug}`}>
                    <p className="font-bold text-xl">{post.title}</p>
                    <p className="text-lg">{truncate(post.content)}</p>
                  </Link>
                </div>
              ))}
            </div>
            <div className="col-span-3 flex flex-col w-full justify-around items-center">
              <div>
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
        </div>
      )}
    </>
  );
}
