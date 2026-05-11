import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // ✅ One brand name everywhere — was "ShopKart" in layout but "ShopEase" in header
  title: {
    default: "ShopEase — India's next-gen marketplace",
    template: "%s · ShopEase",
  },
  description:
    "Shop electronics, fashion, home & more on ShopEase. Curated products, honest prices, free delivery over ₹500.",
  keywords: [
    "ecommerce",
    "online shopping",
    "electronics",
    "fashion",
    "ShopEase",
    "India",
  ],
  authors: [{ name: "ShopEase" }],
  openGraph: {
    title: "ShopEase — India's next-gen marketplace",
    description:
      "Curated products, honest prices, free delivery over ₹500.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopEase",
    description: "India's next-gen marketplace",
  },
  // Helps mobile browser theme chrome match the brand
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <Providers>
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}