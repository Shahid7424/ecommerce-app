// src/app/products/page.tsx
"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../components/ProductCard";
import { resolveCategory } from "../lib/categories";
import { ProductGridSkeleton } from "../components/Productcardskelton";
import Cart from "../components/Cart";
import Header from "../components/Header";
import { useCart } from "../hooks/useCart";
import type { Product } from "../types/product";
import { Search } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("cat");
  const queryParam = searchParams.get("q") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(queryParam);

  // ✅ Same cart source as homepage — state is shared via localStorage
  const {
    cart,
    hydrated,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalItems,
  } = useCart();

  // Fetch products
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (!cancelled && data.success) setProducts(data.products);
      } catch (err) {
        console.error("Frontend fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter by ?cat= and ?q=
  // ✅ REPLACE WITH THIS — uses resolveCategory()
const filtered = useMemo(() => {
  const allowedCategories = resolveCategory(categoryParam);
  return products.filter((p) => {
    const matchesCategory =
      !allowedCategories ||
      allowedCategories.includes(p.category.toLowerCase());
    const matchesQuery =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });
}, [products, categoryParam, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        cartCount={hydrated ? totalItems : 0}
        onCartClick={() => setCartOpen(true)}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {categoryParam
              ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
              : "All Products"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Loading…" : `${filtered.length} products`}
          </p>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 ring-1 ring-slate-200">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100">
              <Search size={28} className="text-slate-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No products found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try a different category or search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onProductClick={(p) => console.log("Open product", p.id)}
              />
            ))}
          </div>
        )}
      </div>

      {hydrated && (
        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cart.map(item => ({ ...item, id: item.id! }))}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  // useSearchParams requires Suspense in Next 16
  return (
    <Suspense fallback={<ProductGridSkeleton count={8} />}>
      <ProductsContent />
    </Suspense>
  );
}