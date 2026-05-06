/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Product {
  // ✅ allow flexible fields (fixes specs error)
  [key: string]: any;

  id: string;
  title: string;
  description: string;
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

  specs?: {
    [key: string]: string;
  };

  features?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses?: Address[];
}

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

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  address: Address;
  orderDate: string;
  deliveryDate?: string;
}