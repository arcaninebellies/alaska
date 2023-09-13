import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/prisma";
import upload from "@/upload";
import { zfd } from "zod-form-data";

export async function GET(request: Request, response: Response) {
  const session = await getServerSession(OPTIONS);

  if (session?.user?.email) {
    const email = session.user.email;

    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        posts: {
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });
    return NextResponse.json({ user });
  }
}

export async function POST(request: Request, response: Response) {
  const session = await getServerSession(OPTIONS);

  if (session?.user?.email) {
    const email = session.user.email;
    const data = await request.formData();

    const schema = zfd.formData({
      username: zfd.text(),
      description: zfd.text(),
      avatar: zfd.text().optional(),
    });

    const response = schema.safeParse(data);
    if (!response.success) {
      return NextResponse.json({ error: response.error });
    }

    const { username, description } = response.data;
    if (response.data.avatar) {
      const avatar = response.data.avatar;
      const buffer = Buffer.from(
        avatar.replace(/^data:image\/\w+;base64,/, ""),
        "base64",
      );
      const uuid = await upload(buffer, "avatars");

      const user = await prisma.user.update({
        where: { email },
        data: { username, description, avatar: uuid },
      });
      return NextResponse.json({ user });
    } else {
      const user = await prisma.user.update({
        where: { email },
        data: { username, description },
      });
      return NextResponse.json({ user });
    }
  }
}
