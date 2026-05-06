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
              <p>
                Delivery: {delivery === 0 ? "FREE" : `₹${delivery}`}
              </p>
              <p className="font-bold mt-2">Total: ₹{total}</p>

              {/* 💳 PAYPAL BUTTON */}
              <div className="mt-4">
                <PayPalScriptProvider
                  options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: total.toString(),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then(() => {
                        alert("Payment Successful 🎉");

                        // ✅ clear cart
                        localStorage.removeItem("cart");

                        // ✅ redirect
                        router.push("/success");
                      });
                    }}
                    onError={(err: unknown) => {
                      if (err instanceof Error) {
                        console.error(err);
                      } else {
                        console.error("Payment error", err);
                      }
                      alert("Payment failed");
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