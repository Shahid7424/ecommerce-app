/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  images: string[];
  brand: string;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem
}) => {
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (!isOpen) return null;

const handleCheckout = () => {
  onClose(); // 👈 close drawer

  if (!session) {
    router.push("/login?callbackUrl=/checkout");
    return;
  }

  router.push("/checkout");
};

const { data: session } = useSession();
const router = useRouter();  



  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-indigo-600 text-white">
          <div className="flex items-center space-x-2">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-bold">Shopping Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-indigo-700 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={80} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add items to get started!</p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {/* Product Image */}
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-20 h-20 object-contain bg-white rounded border"
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase">{item.brand}</p>
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {item.title}
                    </h4>
                    
                    {/* Price */}
                    <div className="flex items-baseline space-x-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Price Summary */}
        {items.length > 0 && (
          <div className="border-t bg-gray-50 p-4 space-y-3">
            {/* Coupon Code */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition">
                Apply
              </button>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center">
                    <Tag size={14} className="mr-1" />
                    Savings
                  </span>
                  <span className="font-semibold">-{formatPrice(savings)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              </div>

              {subtotal < 500 && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  Add ₹{(500 - subtotal).toLocaleString()} more for FREE delivery!
                </p>
              )}

              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-indigo-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
           <button
  onClick={handleCheckout}
  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
>
  Proceed to Checkout
</button>

            <button 
              onClick={onClose}
              className="w-full py-2 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// ✅ DEFAULT EXPORT
export default Cart;