import { headers } from "next/headers";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import sanitizeHtml from "sanitize-html";

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/article/`, {
    method: "GET",
    headers: headers(),
  });
  return res.json();
}

export default async function Articles() {
  const data = await getData();
  const user = data.user;
  dayjs.extend(customParseFormat);

  const truncate = (str: string): string => {
    return str.length > 100 ? str.slice(0, 97) + "..." : str;
  };

  return (
    <>
      {user && (
        <div className="flex flex-col bg-slate-100 min-h-screen w-full text-black p-24 items-center">
          <p className="text-4xl font-bold">Articles</p>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2"></div>
            <div className="col-span-8 flex flex-col justify-items-start content-start justify-start  divide-y">
              <Tabs defaultValue="stories" className="w-full">
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
                          <div className="flex flex-row justify-between items-center">
                            <p className="font-bold text-xl">{post.title}</p>
                            <p className="text-sm text-slate-400">
                              Published{" "}
                              {dayjs(post.createdAt).format("YYYY-MM-DD")}
                            </p>
                          </div>
                          <div
                            className="text-lg"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(truncate(post.content)),
                            }}
                          ></div>{" "}
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
                          <div className="flex flex-row justify-between items-center">
                            <p className="font-bold text-xl">{post.title}</p>
                            <p className="text-sm text-slate-400">
                              Created at{" "}
                              {dayjs(post.createdAt).format("YYYY-MM-DD")}
                            </p>
                          </div>
                          <div
                            className="text-lg"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(truncate(post.content)),
                            }}
                          ></div>{" "}
                        </Link>
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </div>
            <div className="col-span-2"></div>
          </div>
        </div>
      )}
    </>
  );
}
