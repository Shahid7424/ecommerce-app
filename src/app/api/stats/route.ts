/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import connectDB from "../../lib/db";
import { Product } from "../../models/Product";
import User from "../../models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [
      totalProducts,
      outOfStockCount,
      totalCustomers,
      totalAdmins,
      recentProducts,
      recentUsers,
      categoryStats,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ inStock: false }),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "admin" }),
      Product.find().sort({ createdAt: -1 }).limit(5).lean(),
      User.find({ role: "customer" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email createdAt")
        .lean(),
      Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        inStockCount: totalProducts - outOfStockCount,
        outOfStockCount,
        totalCustomers,
        totalAdmins,
      },
      recentProducts: recentProducts.map((p: any) => ({
        _id: p._id?.toString(),
        title: p.title,
        price: p.price,
        category: p.category,
        images: p.images,
        inStock: p.inStock,
        createdAt: p.createdAt,
      })),
      recentUsers: recentUsers.map((u: any) => ({
        _id: u._id?.toString(),
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
      })),
      categoryStats: categoryStats.map((c: any) => ({
        category: c._id || "Uncategorized",
        count: c.count,
      })),
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json(
      { message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}