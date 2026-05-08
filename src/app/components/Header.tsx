"use client";
import React, { useState } from "react";
import { Search, ShoppingCart, MapPin, User, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar - Desktop */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-4">
              <button className="flex items-center hover:text-indigo-200">
                <MapPin size={14} className="mr-1" />
                <span className="hidden sm:inline">
                  Deliver to Narnaund 126152
                </span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hover:text-indigo-200">
                Customer Service
              </button>
              <button className="hover:text-indigo-200">Track Order</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden mr-3 p-2"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex-shrink-0">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ShopEase
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Your trusted marketplace
                </p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="w-full pl-4 pr-12 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-indigo-600 hover:bg-indigo-700 rounded-r-lg transition">
                  <Search size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="hidden sm:flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <User size={20} className="mr-2" />
                  <span className="font-medium">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => router.push("/admin-login")}
                  className="hidden sm:flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <User size={20} className="mr-2" />
                  <span className="font-medium">Login</span>
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={onCartClick}
                className="relative flex items-center px-3 sm:px-4 py-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ShoppingCart size={24} className="text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
                <span className="hidden sm:inline ml-2 font-medium">Cart</span>
              </button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-12 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-indigo-600 rounded-r-lg">
                <Search size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-6 overflow-x-auto h-12 text-sm">
            <button className="whitespace-nowrap hover:text-indigo-600 font-medium">
              Electronics
            </button>
            <button className="whitespace-nowrap hover:text-indigo-600 font-medium">
              Fashion
            </button>
            <button className="whitespace-nowrap hover:text-indigo-600 font-medium">
              Home & Kitchen
            </button>
            <button className="whitespace-nowrap hover:text-indigo-600 font-medium">
              Beauty
            </button>
            <button className="whitespace-nowrap hover:text-indigo-600 font-medium">
              Sports
            </button>
            <button className="whitespace-nowrap hover:text-indigo-600 font-medium">
              Books
            </button>
            <button className="whitespace-nowrap hover:text-indigo-600 font-medium">
              Toys
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b py-4">
          <div className="px-4 space-y-3">
            <button className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded-lg flex items-center">
              <User size={18} className="mr-3" />
              My Account
            </button>
            <button className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded-lg">
              Orders
            </button>
            <button className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded-lg">
              Wishlist
            </button>
            <button className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded-lg">
              Customer Service
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// ✅ EXPORT - Yahan pe export add kiya hai
export default Header;
