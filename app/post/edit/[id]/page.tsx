"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
  EditorProvider,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Blockquote from "@tiptap/extension-blockquote";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import lowlight from "lowlight";
import TipTap from "@/app/util/TipTap";

type Post = {
  title: string;
  content: string;
  draft: boolean;
  id: string;
};
export default function EditPost({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<Post>({
    title: "",
    content: "",
    draft: false,
    id: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Blockquote,
      Underline,
      Code,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: data.content,
    onUpdate: ({ editor }) => {
      setData({ ...data, content: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class: "h-screen w-full bg-slate-100 text-4xl focus:outline-none",
      },
    },
  });

  useEffect(() => {
    fetch(`/api/post/edit?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => setData(data.post));
  }, [params.id]);

  const submit = (draft: boolean) => {
    setData({ ...data, draft: draft });
    fetch("/api/post/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        router.push(`/user/${data.post.user.username}`);
      });
  };

  return (
    <>
      {session && (
        <div className="flex flex-col p-4 items-center content-start bg-slate-100 min-h-screen w-full text-black">
          <div className="flex flex-row">
            <button
              onClick={() => submit(false)}
              className="bg-emerald-400/75 rounded-lg p-4 text-slate-100 hover:bg-emerald-400 mr-4"
            >
              Publish
            </button>
            <button
              onClick={() => submit(true)}
              className="bg-emerald-400/75 rounded-lg p-4 text-slate-100 hover:bg-emerald-400"
            >
              Save As Draft
            </button>
          </div>

          <input
            className="border-transparent focus:border-transparent focus:outline-none text-4xl w-4/6 bg-slate-100"
            size={50}
            type="text"
            value={data.title}
            placeholder="Title...."
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
          <TipTap data={data} setData={setData} />
        </div>
      )}
    </>
  );
}
