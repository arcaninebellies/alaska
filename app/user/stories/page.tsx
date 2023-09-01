import { headers } from "next/headers";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function getData() {
  const res = await fetch(`${process.env.NEXT_URL}/api/stories/`, {
    method: "GET",
    headers: headers(),
  });
  return res.json();
}

export default async function Drafts() {
  const data = await getData();
  const user = data.user;
  console.log(data.user);

  const truncate = (str: string): string => {
    return str.length > 100 ? str.slice(0, 97) + "..." : str;
  };

  return (
    <>
      {user && (
        <div className="flex flex-col bg-slate-100 min-h-screen w-full text-black p-24">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2"></div>
            <div className="col-span-5 flex flex-col justify-items-start content-start justify-start  divide-y">
              <Tabs defaultValue="stories" className="w-[1000px]">
                <TabsList>
                  <TabsTrigger value="stories" className="w-[400px]">
                    Stories
                  </TabsTrigger>
                  <TabsTrigger value="drafts" className="w-[400px]">
                    Drafts
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="stories">
                  {user.posts
                    .filter((post) => post.draft === false)
                    .map((post) => (
                      <div key={post.id} className="flex flex-col">
                        <Link
                          href={`/user/${user.username}/${post.id}/${post.slug}`}
                        >
                          <p className="font-bold text-xl">{post.title}</p>
                          <p className="text-lg">{truncate(post.content)}</p>
                        </Link>
                      </div>
                    ))}
                </TabsContent>
                <TabsContent value="drafts">
                  {user.posts
                    .filter((post) => post.draft === true)
                    .map((post) => (
                      <div key={post.id} className="flex flex-col">
                        <Link href={`/post/edit/${post.id}/`}>
                          <p className="font-bold text-xl">{post.title}</p>
                          <p className="text-lg">{truncate(post.content)}</p>
                        </Link>
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
