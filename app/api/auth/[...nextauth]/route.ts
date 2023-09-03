import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import GithubHandler from "next-auth/providers/github";
import fs from "fs";
import prisma from "@/prisma";

export const OPTIONS = {
  providers: [
    GithubHandler({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const user_ = await prisma.user.findFirst({
        where: { email: profile.email },
      });
      console.log(profile);

      if (!user_) {
        // download avatar
        const res = await fetch(profile.avatar_url);
        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFileSync(`./public/avatars/${profile.id}.png`, buffer);
        await prisma.user.upsert({
          where: { email: profile.email },
          update: {},
          create: {
            email: profile.email,
            username: profile.login,
            avatar: `${profile.id}.png`,
          },
        });
      }
      return true;
    },
  },
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
