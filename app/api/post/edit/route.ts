import { getServerSession } from "next-auth";
import { OPTIONS } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id"))!;
  const prisma = new PrismaClient();
  const session = await getServerSession(OPTIONS);

  if (session?.user?.email) {
    const post = await prisma.post.findFirst({
      where: {
        user: {
          email: session.user.email,
        },
        id,
      },
    });
    return NextResponse.json({ post });
  }
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
      const post = await prisma.post.update({
        where: { id: data.id },
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

export async function DELETE(request: Request, response: Response) {
  const session = await getServerSession(OPTIONS);

  if (session?.user?.email) {
    const prisma = new PrismaClient();
    const email = session.user.email;
    const data = await request.json();

    await prisma.post.delete({
      where: {
        user: {
          email,
        },
        id: data.id,
      },
    });
    return NextResponse.json({ success: true });
  }
}
