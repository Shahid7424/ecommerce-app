"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/app/types/product";
import Link from "next/link";
export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/admin/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const deleteProduct = async (id: string) => {
    await fetch(`/api/admin/products?id=${id}`, {
      method: "DELETE",
    });
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/addProducts"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t">
                <td className="p-3">{product.title}</td>
                <td className="p-3">₹{product.price}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
