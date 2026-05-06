import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import * as bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();

  const { email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashedPassword,
  });

  return NextResponse.json({ success: true });
}