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
  title: {
    default: "ShopEase — Maryland's next-gen marketplace",
    template: "%s · ShopEase",
  },

  description:
    "Shop electronics, fashion, home & more on ShopEase. Curated products, honest prices, and a seamless checkout experience.",

  keywords: [
    "ecommerce",
    "online shopping",
    "electronics",
    "fashion",
    "ShopEase",
    "Maryland",
  ],

  authors: [{ name: "ShopEase" }],

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  openGraph: {
    title: "ShopEase — Maryland's next-gen marketplace",
    description:
      "Curated products, honest prices, and a checkout that just works.",
    type: "website",
    locale: "en_US",
    siteName: "ShopEase",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ShopEase Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ShopEase",
    description: "Maryland's next-gen marketplace",
    images: ["/logo.png"],
  },

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