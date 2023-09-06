"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
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
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import lowlight from "lowlight";

export default function TipTap({ data, setData }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Blockquote,
      Underline,
      Code,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: "Content....",
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

  return (
    <div className="h-screen w-screen flex justify-center p-24">
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem
                onClick={() => editor.chain().focus().toggleBold().run()}
                className="cursor-pointer"
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Bold
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className="cursor-pointer"
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Blockquote
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem
                onClick={() => editor.chain().focus().toggleCode().run()}
                className="cursor-pointer"
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Code
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className="cursor-pointer"
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Codeblock
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className="cursor-pointer"
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Italic
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className="cursor-pointer"
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Strikethrough
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className="cursor-pointer"
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Underline
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
