"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingCart,
  MapPin,
  User,
  Menu,
  X,
  Heart,
  Package,
} from "lucide-react";
import { NAV_CATEGORIES } from "../lib/categories";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

const Header: React.FC<HeaderProps> = ({
  cartCount,
  onCartClick,
  onSearchChange,
  searchQuery,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // ✅ Search now actually navigates somewhere when submitted
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top utility strip */}
      <div className="bg-slate-900 text-slate-200">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
          <button className="flex items-center gap-1.5 hover:text-white">
            <MapPin size={12} />
            <span className="hidden sm:inline">Deliver to Hagerstown MD, 21740</span>
            <span className="sm:hidden">Deliver here</span>
          </button>
          <div className="flex items-center gap-4">
            <Link href="/help" className="hover:text-white">
              Customer Service
            </Link>
            <Link href="/orders" className="hover:text-white">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setShowMobileMenu((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
          >
            {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                ShopEase
              </span>
            </h1>
            <p className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:block">
              Your trusted marketplace
            </p>
          </Link>

          {/* Search (desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden flex-1 md:flex md:max-w-2xl md:mx-4 lg:mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search for products, brands and more…"
                aria-label="Search products"
                className="w-full rounded-full border-2 border-slate-200 bg-slate-50 py-2.5 pl-5 pr-14 text-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-indigo-600 p-2 text-white transition hover:bg-indigo-700"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 sm:flex"
            >
              <Heart size={22} />
            </Link>

            {/* Account dropdown */}
            {session ? (
              <div className="group relative hidden sm:block">
                <button
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  aria-label="Account menu"
                >
                  <User size={18} />
                  <span className="max-w-[80px] truncate">
                    {session.user?.name || "Account"}
                  </span>
                </button>
                <div className="invisible absolute right-0 top-full w-48 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                  <Link
                    href="/account"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100"
                  >
                    Wishlist
                  </Link>
                  <hr className="my-1 border-slate-200" />
                  <button
                    onClick={() => signOut()}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <button
                // ✅ FIX: was /admin-login (the admin route!) — regular users go to /login
                onClick={() => router.push("/login")}
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:flex"
              >
                <User size={18} />
                <span>Login</span>
              </button>
            )}

            {/* Cart */}
            <button
              onClick={onCartClick}
              aria-label={`Cart with ${cartCount} items`}
              className="relative flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-slate-100"
            >
              <ShoppingCart size={22} className="text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
              <span className="hidden text-sm font-medium sm:inline">Cart</span>
            </button>
          </div>
        </div>

        {/* Search (mobile) */}
        <div className="border-t border-slate-100 px-4 pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="w-full rounded-full border-2 border-slate-200 bg-slate-50 py-2 pl-4 pr-12 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-indigo-600 p-1.5 text-white"
            >
              <Search size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* ✅ Categories nav — now actually links to /products?cat=... */}
      <nav className="hidden border-b border-slate-200 bg-slate-50 md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex h-11 items-center gap-1 overflow-x-auto">
            {NAV_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products?cat=${c.slug}`}
                  className="block whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                >
                  {c.label}
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link
                href="/deals"
                className="block whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
              >
                🔥 Today&apos;s Deals
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {showMobileMenu && (
        <div className="border-b border-slate-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Categories
            </p>
            {NAV_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/products?cat=${c.slug}`}
                onClick={() => setShowMobileMenu(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {c.label}
              </Link>
            ))}

            <hr className="my-2 border-slate-200" />

            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Account
            </p>
            <Link
              href="/account"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
            >
              <User size={16} /> My Account
            </Link>
            <Link
              href="/orders"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
            >
              <Package size={16} /> Orders
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
            >
              <Heart size={16} /> Wishlist
            </Link>

            {session ? (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  signOut();
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                Log out
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push("/login");
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;