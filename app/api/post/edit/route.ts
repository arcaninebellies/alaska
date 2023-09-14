import { getServerSession } from "next-auth";
import { OPTIONS } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import slugify from "slugify";
import prisma from "@/prisma";
import { z } from "zod";

export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id")!);
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
    const email = session.user.email;
    const schema = z.object({
      title: z.string(),
      content: z.string(),
      draft: z.boolean(),
      id: z.string(),
    });

    const response = schema.safeParse(await request.json());
    if (!response.success) {
      return NextResponse.json({ error: response.error });
    }

    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        posts: true,
      },
    });

    const { id, title, content, draft } = response.data;

    if (user) {
      const post = await prisma.post.update({
        where: { id: parseInt(id) },
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

export async function DELETE(request: Request, response: Response) {
  const session = await getServerSession(OPTIONS);

  if (session?.user?.email) {
    const email = session.user.email;
    const data = await request.json();

    const schema = z.object({
      id: z.string(),
    });

    const response = schema.safeParse(await request.json());
    if (!response.success) {
      return NextResponse.json({ error: response.error });
    }
    const { id } = response.data;
    await prisma.post.delete({
      where: {
        user: {
          email,
        },
        id: parseInt(id),
      },
    });
    return NextResponse.json({ success: true });
  }
}
