import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import slugify from "slugify";
import prisma from "@/prisma";
import { z } from "zod";

export async function POST(request: Request, response: Response) {
  const session = await getServerSession(OPTIONS);

  if (session?.user?.email) {
    const schema = z.object({
      content: z.string(),
      id: z.string(),
    });

    const response = schema.safeParse(await request.json());
    if (!response.success) {
      return NextResponse.json({ error: response.error });
    }

    const { id, content } = response.data;

    const email = session.user.email;

    const post = await prisma.post.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (post && user) {
      const comment = await prisma.comment.create({
        data: {
          content: content,
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
}
