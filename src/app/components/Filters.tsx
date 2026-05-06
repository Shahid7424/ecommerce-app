
'use client'; // ⚡ CLIENT COMPONENT

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, X } from 'lucide-react';

interface FilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedRating: number | null;
  onRatingChange: (rating: number | null) => void;
  brands: string[];
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  onClearFilters: () => void;
}

export const Filters: React.FC<FilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedRating,
  onRatingChange,
  brands,
  selectedBrands,
  onBrandToggle,
  onClearFilters
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    brand: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const priceRanges = [
    { label: 'Under ₹1,000', min: 0, max: 1000 },
    { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
    { label: 'Above ₹25,000', min: 25000, max: Infinity }
  ];

  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
        >
          <X size={16} className="mr-1" />
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900">Category</h3>
          {expandedSections.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category}
                  onChange={() => onCategoryChange(category)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-indigo-600">
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-6 pb-6 border-b">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900">Price Range</h3>
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {expandedSections.price && (
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label
                key={index}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={priceRange[0] === range.min && priceRange[1] === range.max}
                  onChange={() => onPriceRangeChange([range.min, range.max])}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-indigo-600">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-6 pb-6 border-b">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900">Customer Rating</h3>
          {expandedSections.rating ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {expandedSections.rating && (
          <div className="space-y-2">
            {ratings.map((rating) => (
              <label
                key={rating}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() => onRatingChange(rating)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-3 flex items-center">
                  <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                    <span>{rating}</span>
                    <Star size={10} className="ml-1 fill-white" />
                  </div>
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-indigo-600">
                    & above
                  </span>
                </div>
              </label>
            ))}
            <button
              onClick={() => onRatingChange(null)}
              className="text-sm text-gray-500 hover:text-indigo-600"
            >
              Clear rating filter
            </button>
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900">Brand</h3>
          {expandedSections.brand ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {expandedSections.brand && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onBrandToggle(brand)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-indigo-600">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'All' || selectedRating || selectedBrands.length > 0) && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                {selectedCategory}
                <button
                  onClick={() => onCategoryChange('All')}
                  className="ml-2 hover:text-indigo-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedRating && (
              <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                {selectedRating}★ & above
                <button
                  onClick={() => onRatingChange(null)}
                  className="ml-2 hover:text-indigo-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedBrands.map((brand) => (
              <span
                key={brand}
                className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full"
              >
                {brand}
                <button
                  onClick={() => onBrandToggle(brand)}
                  className="ml-2 hover:text-indigo-900"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ DEFAULT EXPORT
export default Filters;