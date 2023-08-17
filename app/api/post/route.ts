import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

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
        },
      });
      return NextResponse.json({ post });
    }
  }
}
