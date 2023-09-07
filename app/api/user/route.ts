import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/prisma";
import upload from "@/upload";

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

    let dataToSave = {
      username: data.get("username") as string,
      description: data.get("description") as string,
    };

    if (data.get("avatar")) {
      const avatar = data.get("avatar") as string;
      const buffer = Buffer.from(
        avatar.replace(/^data:image\/\w+;base64,/, ""),
        "base64",
      );
      const uuid = await upload(buffer, "avatars");

      dataToSave["avatar"] = uuid;
    }

    const user = await prisma.user.update({
      where: { email },
      data: { ...dataToSave },
    });

    return NextResponse.json({ user });
  }
}
