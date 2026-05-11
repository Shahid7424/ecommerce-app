// src/app/types/product.ts

/**
 * A product as it exists in your app.
 *
 * Note on IDs:
 *   - `id`  → string ID from the dummyjson API (used on customer-facing pages)
 *   - `_id` → MongoDB ObjectId from your own DB (used in admin pages)
 *   Both are optional because depending on the source, only one will be set.
 *   Use a helper like `getProductId(p)` (see bottom of file) to read whichever exists.
 */
export interface Product {
  id?: string;
  _id?: string;

  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;

  rating: number;
  reviewCount: number;

  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  inStock: boolean;

  specs?: Record<string, string>;
  features?: string[];

  // Mongoose timestamps (only present on DB-saved products)
  createdAt?: string;
  updatedAt?: string;
}

/** A product in the cart — same shape, plus quantity. */
export interface CartItem extends Omit<Product, "specs" | "features"> {
  quantity: number;
}

/** App user (matches your MongoDB User model). */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  addresses?: Address[];
}

/** Shipping address. */
export interface Address {
  id: string;
  fullName: string;
  phone: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  isDefault: boolean;
}

/** A customer's order. */
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  address: Address;
  orderDate: string;
  deliveryDate?: string;
}

/**
 * Helper: get whichever ID is present on a product.
 * Use this anywhere you need a stable key (cart, wishlist, React `key` props).
 *
 *   const id = getProductId(product);
 */
export function getProductId(product: Product): string {
  return product._id ?? product.id ?? "";
}