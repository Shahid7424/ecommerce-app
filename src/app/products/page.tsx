/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "../components/ProductCard";
import Cart from "../components/Cart";
import type { Product } from "../types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  // ✅ Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          console.error("API returned error:", data);
        }
      } catch (error) {
        console.error("Frontend fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // ✅ Add to cart
  const handleAddToCart = (product: Product) => {
    const id = product.id;
    const exists = items.find((i) => i.id === id);

    if (exists) {
      setItems(
        items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setItems([
        ...items,
        {
          id,
          title: product.title,
          price: product.price,
          images: product.images,
          brand: product.brand ?? "",
          quantity: 1,
        },
      ]);
    }

    setCartOpen(true);
  };

  // ✅ FIX: matches Cart's onUpdateQuantity(id: string, quantity: number)
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
    }
  };

  // ✅ FIX: matches Cart's onRemoveItem(id: string)
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) {
    return <p className="p-6">Loading products…</p>;
  }

  return (
    <div className="p-6">
      <ProductGrid
        products={products}
        onAddToCart={handleAddToCart}
        onProductClick={(product) => console.log("Open product", product)}
      />

      {/* ✅ FIX: replaced onUpdateItems with correct prop names */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}