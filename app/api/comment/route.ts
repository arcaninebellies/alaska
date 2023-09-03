import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import slugify from "slugify";
import prisma from "@/prisma";

export async function POST(request: Request, response: Response) {
  const session = await getServerSession(OPTIONS);

  if (session?.user?.email) {
    const email = session.user.email;
    const data = await request.json();

    const post = await prisma.post.findFirst({
      where: {
        id: data.id,
      },
    });

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        post: {
          connect: {
            id: post.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ comment });
  }
}
