import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/prisma";

export async function GET(request: Request, response: Response) {
  const session = await getServerSession(OPTIONS);
  console.log(session);
  if (session?.user?.email) {
    const email = session.user.email;
    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return NextResponse.json({ user });
  } else {
    return NextResponse.json({ ok: session });
  }
}
