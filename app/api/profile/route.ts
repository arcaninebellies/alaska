import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")!;
  const prisma = new PrismaClient();

  const user = await prisma.user.findFirst({
    where: { username },
    include: {
      posts: {
        where: {
          draft: false,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });
  return NextResponse.json({ user });
}
