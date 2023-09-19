// @ts-nocheck

import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import GithubHandler from "next-auth/providers/github";
import fs from "fs";
import prisma from "@/prisma";
import upload from "@/upload";

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

      if (!user_) {
        // download avatar
        const res = await fetch(profile.avatar_url);
        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const uuid = await upload(arrayBuffer, "uploads");

        await prisma.user.upsert({
          where: { email: profile.email },
          update: {},
          create: {
            email: profile.email,
            username: profile.login,
            avatar: uuid,
          },
        });
      }
      return true;
    },
  },
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
