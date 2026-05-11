"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import Filters from "./components/Filters";
import Hero from "./components/Hero";
import { ProductGridSkeleton } from "./components/Productcardskelton";
import { useCart } from "./hooks/useCart";
import type { Product } from "./types/product";
import { Search } from "lucide-react";

export default function ShopClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // ✅ Cart logic lives in a hook now — no more 3x duplicated localStorage calls
  const {
    cart,
    hydrated,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalItems,
  } = useCart();

  // Fetch products
  // ❌ Purana — crash karta hai agar response JSON nahi hai
// const res = await fetch("/api/products");
// const data = await res.json();

// ✅ Naya — safe parsing
useEffect(() => {
  let cancelled = false;
  (async () => {
    try {
      const res = await fetch("/api/products");

      // ✅ Pehle check karo response JSON hai ya nahi
      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await res.json();
      if (!cancelled && data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      if (!cancelled) setLoading(false);
    }
  })();
  return () => { cancelled = true; };
}, []);
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchesRating =
        selectedRating === null || p.rating >= selectedRating;
      const matchesPrice =
        p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      return (
        matchesSearch &&
        matchesCategory &&
        matchesRating &&
        matchesPrice &&
        matchesBrand
      );
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedRating,
    priceRange,
    selectedBrands,
  ]);

  const handleBrandToggle = (brand: string) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSelectedRating(null);
    setPriceRange([0, Infinity]);
    setSelectedBrands([]);
    setSearchQuery("");
  };

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );
  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))),
    [products]
  );

  // ✅ Don't render the whole tree blank — still show header + hero shell
  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        cartCount={hydrated ? totalItems : 0}
        onCartClick={() => setShowCart(true)}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* New: Hero section + category tiles */}
      <Hero />

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <aside className="hidden w-64 flex-shrink-0 md:block">
          <Filters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            brands={brands}
            selectedBrands={selectedBrands}
            onBrandToggle={handleBrandToggle}
            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        <main className="flex-1">
          {/* Section heading */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {searchQuery ? "Search Results" : "Trending Now"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading products…"
                  : `${filteredProducts.length} products found`}
              </p>
            </div>
          </div>

          {/* Body — loading / empty / grid */}
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState onClear={handleClearFilters} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onProductClick={(p) => {
                    // TODO: route to `/products/${p.id}` when detail page exists
                    console.log("clicked", p.id);
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {hydrated && (
        <Cart
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          items={cart.map(item => ({...item, id: item.id as string}))}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
        />
      )}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 ring-1 ring-slate-200">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100">
        <Search size={28} className="text-slate-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        No products found
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Try adjusting your filters or search query.
      </p>
      <button
        onClick={onClear}
        className="mt-5 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
      >
        Clear all filters
      </button>
    </div>
  );
}