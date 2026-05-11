/* eslint-disable react-hooks/set-state-in-effect */
// src/app/hooks/useCart.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product, CartItem } from "../types/product";

const STORAGE_KEY = "cart";

/**
 * Centralised cart state.
 *
 * Why this exists: in the original ShopClient.tsx, every handler
 * (addToCart, updateQuantity, removeFromCart) was manually calling
 * `localStorage.setItem("cart", ...)`. If any one of them forgot,
 * state silently desyncs. This hook owns persistence in ONE place
 * — a useEffect that runs whenever `cart` changes.
 *
 * Usage:
 *   const { cart, addToCart, updateQuantity, removeFromCart, totalItems } = useCart();
 */
export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {
      // corrupted blob — ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on every change (but only after hydration to avoid wiping)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // quota exceeded etc — silent fail is fine for a cart
    }
  }, [cart, hydrated]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Strip `specs` so we don't bloat localStorage with unused data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { specs: _specs, ...rest } = product;
      return [...prev, { ...rest, quantity: 1 } as CartItem];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return {
    cart,
    hydrated,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
  };
}