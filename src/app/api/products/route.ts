/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://dummyjson.com/products");

    const data = await res.json();

    const products = data.products.map((p: any) => {
      const priceINR = Math.round(p.price * 80);

      return {
        id: p.id.toString(),
        title: p.title,
        description: p.description,
        price: priceINR,
        originalPrice: priceINR + 500,
        discount: p.discountPercentage || 10,
        rating: p.rating,
        reviewCount: 100,
        images: p.images,
        category: p.category,
        brand: p.brand || "Generic",
        inStock: p.stock > 0,
      };
    });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Server crashed" },
      { status: 500 }
    );
  }
}