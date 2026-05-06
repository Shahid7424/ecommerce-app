"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductsPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        price: Number(price),
        category,
        brand: "Generic",
        images: [],
        inStock: true,
      }),
    });

    router.push("/admin/products");
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Product Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}
