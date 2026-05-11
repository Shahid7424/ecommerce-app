/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // ✅ limit=0 → sare 194 products, revalidate = 1 hour cache
    const res = await fetch("https://dummyjson.com/products?limit=0", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`DummyJSON error: ${res.status}`);
    }

    const data = await res.json();

    if (!data.products || !Array.isArray(data.products)) {
      throw new Error("Invalid response from DummyJSON");
    }

    const products = data.products.map((p: any) => {
      const priceINR = Math.round(p.price * 84);
      const originalINR = Math.round(priceINR * (1 + (p.discountPercentage || 10) / 100));

      return {
        id: p.id.toString(),
        title: p.title,
        description: p.description,
        price: priceINR,
        originalPrice: originalINR,
        discount: Math.round(p.discountPercentage || 10),
        rating: p.rating,
        reviewCount: p.reviews?.length || Math.floor(Math.random() * 500) + 50,
        images: p.images,
        category: p.category,
        brand: p.brand || "Generic",
        inStock: p.stock > 0,
      };
    });

    return NextResponse.json({ success: true, products });

  } catch (error) {
    console.error("Products API error:", error);
    // ✅ Always return JSON — never plain text
    return NextResponse.json(
      { success: false, error: "Failed to fetch products", products: [] },
      { status: 500 }
    );
  }
}