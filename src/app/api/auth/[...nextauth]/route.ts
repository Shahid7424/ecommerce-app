/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

// ✅ Move your function here
async function authorize(credentials: any) {
  await dbConnect();

  const user = await User.findOne({
    email: credentials?.email,
  });

  if (!user) return null;

  const isMatch = await bcrypt.compare(
    credentials!.password,
    user.password
  );

  if (!isMatch) return null;

  return {
    id: user._id.toString(),
    email: user.email,
  };
}

// ✅ MUST export this
export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize, // 👈 connect here
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/admin-login",
  },
};

// ✅ handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };