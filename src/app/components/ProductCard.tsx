"use client";

import React from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart, Truck, Zap } from "lucide-react";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const PLACEHOLDER = "https://placehold.co/400x400?text=No+Image";

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onProductClick,
}) => {
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

 const formatPrice = (price: number) => `$${price.toLocaleString("en-US")}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted((v) => !v);
  };

  const imgSrc = imageError ? PLACEHOLDER : product.images?.[0] || PLACEHOLDER;
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <article
      onClick={() => onProductClick(product)}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-indigo-200 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <Image
          src={imgSrc}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImageError(true)}
          className="object-contain p-5 transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges (top-left stack) */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.discount && product.discount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
              <Zap size={11} className="fill-white" />
              {product.discount}% OFF
            </span>
          )}
          {product.rating >= 4.5 && (
            <span className="rounded-md bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-amber-900 shadow-sm">
              ★ Top Rated
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-md ring-1 ring-slate-200 backdrop-blur-sm transition hover:scale-110 hover:bg-white"
        >
          <Heart
            size={16}
            className={
              isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-600"
            }
          />
        </button>

        {/* Out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold uppercase tracking-wider text-rose-600 shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {product.brand}
        </p>

        {/* Title */}
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-slate-900 group-hover:text-indigo-600">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2">
          <div className="inline-flex items-center gap-0.5 rounded bg-emerald-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
            {product.rating.toFixed(1)}
            <Star size={9} className="ml-0.5 fill-white" />
          </div>
          <span className="text-xs text-slate-500">
            ({product.reviewCount?.toLocaleString() ?? 0})
          </span>
        </div>

        {/* Price */}
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="mt-0.5 text-xs font-semibold text-emerald-600">
              You save {formatPrice(savings)}
            </p>
          )}
        </div>

        {/* Free delivery hint */}
        {product.price >= 50 && product.inStock && (
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500">
            <Truck size={12} className="text-emerald-600" />
            <span className="font-semibold text-emerald-600">Free</span>{" "}
            delivery
          </p>
        )}

        {/* Push button to bottom */}
        <div className="mt-auto pt-4">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
              product.inStock
                ? "bg-slate-900 text-white shadow-sm hover:bg-indigo-600 hover:shadow-md active:scale-[0.98]"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            <ShoppingCart size={16} />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;