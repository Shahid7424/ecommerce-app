/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./db";
import User from "../models/User";
import bcrypt from "bcryptjs";

async function authorize(credentials: any) {
  await dbConnect();
  const user = await User.findOne({
    email: credentials?.email?.toLowerCase().trim(),
  });
  if (!user) return null;
  const isMatch = await bcrypt.compare(credentials!.password, user.password);
  if (!isMatch) return null;
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = user.name;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};