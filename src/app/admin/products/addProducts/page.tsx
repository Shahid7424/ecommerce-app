"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";

const CATEGORIES = [
  "smartphones", "laptops", "tablets", "mobile-accessories",
  "mens-shirts", "mens-shoes", "womens-dresses", "womens-shoes",
  "furniture", "home-decoration", "kitchen-accessories",
  "beauty", "fragrances", "skin-care",
  "sports-accessories", "groceries",
];

export default function AddProductsPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [brand, setBrand] = useState("");
  const [inStock, setInStock] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ✅ Image upload via Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 2 MB limit (Cloudinary free tier handles up to 10MB, but we keep it sensible)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image too large. Max 2 MB.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Convert file to base64 (your upload API expects base64)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await res.json();
        if (data.url) {
          setImages((prev) => [...prev, data.url]);
        } else {
          setError("Upload failed. Please try again.");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
      setError("Upload failed. Please try again.");
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !price || !category) {
      setError("Title, price and category are required");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          category,
          brand: brand || "Generic",
          images,
          inStock,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/products");
    } catch {
      setSaving(false);
      setError("Failed to save product. Try again.");
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow ring-1 ring-slate-200 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Basic info
          </h2>

          <Field label="Product Title" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Samsung Galaxy S24 Ultra"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief product description…"
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (₹)" required>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="9999"
                min="0"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </Field>

            <Field label="Brand">
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Samsung"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" required>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Availability">
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">In stock</span>
              </label>
            </Field>
          </div>
        </div>

        {/* ✅ Image upload section */}
        <div className="rounded-xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Product images
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Existing images */}
            {images.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50 group"
              >
                <Image
                  src={url}
                  alt={`Product image ${idx + 1}`}
                  fill
                  sizes="200px"
                  className="object-contain p-2"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  aria-label="Remove image"
                  className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-rose-500 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    PRIMARY
                  </span>
                )}
              </div>
            ))}

            {/* Upload button */}
            {images.length < 5 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-indigo-400 hover:bg-indigo-50">
                {uploading ? (
                  <>
                    <Loader2 size={24} className="animate-spin text-indigo-500" />
                    <span className="text-xs text-slate-500">Uploading…</span>
                  </>
                ) : (
                  <>
                    <ImagePlus size={24} className="text-slate-400" />
                    <span className="text-xs font-medium text-slate-600">Add image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Upload up to 5 images. Max 2 MB each. First image is the primary one.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 ring-1 ring-rose-200">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Upload size={16} />
                Save Product
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
    </label>
  );
}