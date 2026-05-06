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

  // ✅ Fetch products (SAFE VERSION)
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        // ✅ Important: check structure
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

  // ✅ Add to cart (FIXED ID ISSUE)
  const handleAddToCart = (product: Product) => {
    const id = product.id; // ✅ FIX: remove _id (not present)

    const exists = items.find((i) => i.id === id);

    if (exists) {
      setItems(
        items.map((i) =>
          i.id === id
            ? { ...i, quantity: i.quantity + 1 }
            : i
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
          quantity: 1,
        },
      ]);
    }

    setCartOpen(true);
  };

  if (loading) {
    return <p className="p-6">Loading products…</p>;
  }

  return (
    <div className="p-6">
      <ProductGrid
        products={products}
        onAddToCart={handleAddToCart}
        onProductClick={(product) =>
          console.log("Open product", product)
        }
      />

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        onUpdateItems={setItems}
      />
    </div>
  );
}