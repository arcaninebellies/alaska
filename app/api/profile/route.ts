import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("user")!;
  const prisma = new PrismaClient();

  const user = await prisma.user.findFirst({
    where: { username },
    include: {
      posts: true,
    },
  });
  return NextResponse.json({ user });
}
