"use client";

import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import type { Product } from "../types/product";



interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}


export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onProductClick 
}) => {
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Card click ko prevent karta hai
    onAddToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      onClick={() => onProductClick(product)}
      className="bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={imageError ? 'https://via.placeholder.com/400?text=No+Image' : product.images[0]}
          alt={product.title}
          onError={() => setImageError(true)}
         
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            {product.discount}% OFF
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <Heart 
            size={18} 
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg font-bold text-red-600">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.brand}
        </p>

        {/* Title */}
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 h-12">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
            <span>{product.rating}</span>
            <Star size={10} className="ml-1 fill-white" />
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price Section */}
        <div className="mb-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.discount && (
            <p className="text-xs text-green-600 font-semibold mt-1">
              You save {formatPrice(product.originalPrice! - product.price)}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
            product.inStock
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={18} />
          <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};

// ProductGrid Component - Multiple cards ko display karne ke liye
interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onAddToCart, 
  onProductClick 
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <ShoppingCart size={64} className="mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
};

// ✅ DEFAULT EXPORTS
export default ProductCard;