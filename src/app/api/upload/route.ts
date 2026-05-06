
import cloudinary from "@/app/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { image } = await req.json();

  const uploaded = await cloudinary.uploader.upload(image, {
    folder: "products",
  });

  return NextResponse.json({ url: uploaded.secure_url });
}