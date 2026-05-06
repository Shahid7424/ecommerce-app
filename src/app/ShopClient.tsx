/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import Filters from "./components/Filters";

import type { Product, CartItem } from "./types/product";

export default function ShopClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (err) {
        console.error(err);
      }
    }
    loadProducts();
  }, []);

  // ✅ FIXED: Now uses ALL filter states, not just search + category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesRating = selectedRating === null || p.rating >= selectedRating;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(p.brand);

      return matchesSearch && matchesCategory && matchesRating && matchesPrice && matchesBrand;
    });
  }, [products, searchQuery, selectedCategory, selectedRating, priceRange, selectedBrands]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        const { specs, ...rest } = product;
        const newCartItem: CartItem = { ...rest, quantity: 1, specs: undefined };
        updated = [...prev, newCartItem];
      }
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(prev => {
      const updated = quantity <= 0
        ? prev.filter(i => i.id !== id)
        : prev.map(i => i.id === id ? { ...i, quantity } : i);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const updated = prev.filter(i => i.id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Derive dynamic filter options from loaded products
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  );
  const brands = useMemo(
    () => Array.from(new Set(products.map(p => p.brand).filter(Boolean))),
    [products]
  );
  const maxPrice = useMemo(
    () => Math.max(...products.map(p => p.price), 0),
    [products]
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartCount={totalItems}
        onCartClick={() => setShowCart(true)}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">

        {/* ✅ FIX: Filters panel is now actually rendered here */}
        <aside className="w-64 flex-shrink-0">
          <Filters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}

            brands={brands}
            selectedBrands={selectedBrands}
            onBrandsChange={setSelectedBrands}

            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}

            priceRange={priceRange}
            maxPrice={maxPrice}
            onPriceRangeChange={setPriceRange}
          />
        </aside>

        <main className="flex-1">
          <h2 className="text-2xl font-bold mb-6">
            {filteredProducts.length} Products Found
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onProductClick={() => {}}
              />
            ))}
          </div>
        </main>
      </div>

      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
}