import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import slugify from "slugify";
import prisma from "@/prisma";
import { z } from "zod";

export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("user")!;
  const slug = searchParams.get("slug")!;
  const id = parseInt(searchParams.get("id")!);

  const post = await prisma.post.findFirst({
    where: {
      user: {
        username,
      },
      slug,
      id,
    },
    include: {
      user: {
        select: {
          email: true,
          username: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
    },
  });
  return NextResponse.json({ post });
}
export async function POST(request: Request, response: Response) {
  const session = await getServerSession(OPTIONS);
  if (session?.user?.email) {
    const email = session.user.email;

    const schema = z.object({
      title: z.string(),
      content: z.string(),
      draft: z.boolean(),
    });

    const response = schema.safeParse(await request.json());
    if (!response.success) {
      return NextResponse.json({ error: response.error });
    }

    const { title, content, draft } = response.data;

    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        posts: true,
      },
    });

    if (user) {
      const post = await prisma.post.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          title,
          content,
          draft,
          slug: slugify(title),
        },
        include: {
          user: true,
        },
      });
      return NextResponse.json({ post });
    }
  }
}
