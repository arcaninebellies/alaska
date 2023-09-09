import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const params = searchParams.get("params")!;

  const posts = await prisma.post.findMany({
    where: { draft: false, title: { contains: params } },
    include: { user: true },
  });
  return NextResponse.json({ posts });
}
