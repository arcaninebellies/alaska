import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("user")!;
  const slug = searchParams.get("slug")!;
  const id = parseInt(searchParams.get("id")!);

  const prisma = new PrismaClient();
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
    const prisma = new PrismaClient();
    const email = session.user.email;
    const data = await request.json();

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
          title: data.title,
          content: data.content,
          draft: data.draft,
          slug: slugify(data.title),
        },
        include: {
          user: true,
        },
      });
      return NextResponse.json({ post });
    }
  }
}
