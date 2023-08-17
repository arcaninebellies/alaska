import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request, response: Response) {
  const session = await getServerSession(OPTIONS);

  if (session?.user?.email) {
    const prisma = new PrismaClient();
    const email = session.user.email;

    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        posts: true,
      },
    });
    return NextResponse.json({ user });
  }
}

export async function POST(request: Request, response: Response) {
  const session = await getServerSession(OPTIONS);

  if (session?.user?.email) {
    const prisma = new PrismaClient();
    const email = session.user.email;
    const data = await request.json();

    const user = await prisma.user.update({
      where: { email },
      data: {
        username: data.username,
        description: data.description,
      },
    });
    return NextResponse.json({ user });
  }
}
