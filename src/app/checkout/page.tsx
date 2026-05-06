"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";


interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);

  // 🔒 Protect page
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [session, status, router]);

  // 📦 Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  if (status === "loading") return <p className="p-5">Loading...</p>;

  // 💰 Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;

  // ✅ Convert ₹ to USD for PayPal (PayPal doesn't support INR)
  const totalInUSD = (total / 84).toFixed(2);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Address Section */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="font-semibold mb-3">Shipping Address</h2>

          <input placeholder="Full Name" className="w-full border p-2 mb-2" />
          <input placeholder="Address" className="w-full border p-2 mb-2" />
          <input placeholder="City" className="w-full border p-2 mb-2" />
          <input placeholder="Pincode" className="w-full border p-2 mb-2" />
        </div>

        {/* Order Summary */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="font-semibold mb-3">Order Summary</h2>

          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <p>Items: ₹{subtotal}</p>
              <p>Delivery: {delivery === 0 ? "FREE" : `₹${delivery}`}</p>
              <p className="font-bold mt-2">Total: ₹{total}</p>
              <p className="text-xs text-gray-400 mb-4">≈ ${totalInUSD} USD (charged via PayPal)</p>

              {/* 💳 PAYPAL BUTTON */}
              <div className="mt-4">
                <PayPalScriptProvider
                  options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                    currency: "USD",
                    intent: "capture",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(_data, actions) => {
                      // ✅ FIX 2: null check on actions.order
                      if (!actions.order) {
                        return Promise.reject(new Error("PayPal order actions unavailable"));
                      }

                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              // ✅ FIX 1: currency_code is now included (required field)
                              currency_code: "USD",
                              value: totalInUSD,
                            },
                            description: "Order from MyShop",
                          },
                        ],
                      });
                    }}
                    onApprove={(_data, actions) => {
                      // ✅ FIX 2: null check on actions.order before capture
                      if (!actions.order) {
                        return Promise.reject(new Error("PayPal order actions unavailable"));
                      }

                      return actions.order.capture().then(() => {
                        alert("Payment Successful 🎉");

                        // ✅ Clear cart
                        localStorage.removeItem("cart");

                        // ✅ Redirect to success page
                        router.push("/success");
                      });
                    }}
                    onError={(err: unknown) => {
                      if (err instanceof Error) {
                        console.error(err);
                      } else {
                        console.error("Payment error", err);
                      }
                      alert("Payment failed. Please try again.");
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}