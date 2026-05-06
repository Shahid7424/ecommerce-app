import { NextResponse } from "next/server";
import connectDB  from "../../../lib/db";
import { Product } from "../../../models/Product";

export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json(product);
}

export async function DELETE(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  await connectDB();
  const body = await req.json();
  const { id, ...data } = body;

  const updated = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });

  return NextResponse.json(updated);
}
