"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Package } from "lucide-react";

interface AdminProduct {
  _id: string;
  title: string;
  price: number;
  category: string;
  brand?: string;
  images?: string[];
  inStock?: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">
            {products.length} {products.length === 1 ? "product" : "products"} in your store
          </p>
        </div>
        <Link
          href="/admin/products/addProducts"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="rounded-xl bg-white shadow ring-1 ring-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-4 w-20">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Price</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <Package size={40} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500">No products found</p>
                  <Link
                    href="/admin/products/addProducts"
                    className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
                  >
                    Add your first product →
                  </Link>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  {/* ✅ Image thumbnail using next/image */}
                  <td className="p-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-slate-200 bg-white">
                      <Image
                        src={
                          product.images?.[0] ||
                          "https://placehold.co/56x56?text=No+Img"
                        }
                        alt={product.title}
                        fill
                        sizes="56px"
                        className="object-contain p-1"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-slate-900 line-clamp-1">{product.title}</p>
                    {product.brand && (
                      <p className="text-xs text-slate-500">{product.brand}</p>
                    )}
                  </td>
                  <td className="p-4 font-semibold text-slate-900">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </td>
                  <td className="p-4">
                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.inStock !== false ? (
                      <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        In stock
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">
                        Out of stock
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteProduct(product._id)}
                      aria-label="Delete product"
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}