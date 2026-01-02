'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardWithBadgesProps {
  product: Product;
}

export default function ProductCardWithBadges({ product }: ProductCardWithBadgesProps) {
  const [isFavorite, setIsFavorite] = useState(product.is_favorite);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // FIXED: discount_percentage is already a number, no need for parseFloat
  const hasDiscount = product.discount_percentage > 0;
  const isTopRated = product.total_rating >= 4;
  
  // FIXED: price_after_discount might be string or number
  // Convert both to numbers for calculation
  const originalPrice = parseFloat(product.original_price);
  const priceAfterDiscount = parseFloat(product.price_after_discount);
  const discountAmount = hasDiscount 
    ? (originalPrice - priceAfterDiscount).toFixed(2)
    : '0';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddingToCart(true);
    // Add to cart logic here
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    // API call to update favorite status
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        )}
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">
            -{product.discount_percentage}%
          </div>
        )}
        
        {/* Top Rated Badge */}
        {isTopRated && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">
            ⭐ Top Rated
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
        >
          <svg
            className={`w-5 h-5 ${
              isFavorite ? 'text-red-500' : 'text-gray-400'
            }`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      
      <div className="mt-3">
        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mt-2">
          {hasDiscount ? (
            <>
              <span className="font-bold text-gray-900 text-lg">
                ${priceAfterDiscount.toFixed(2)}
              </span>
              <span className="text-sm line-through text-gray-500">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="text-xs text-red-600 font-medium">
                Save ${discountAmount}
              </span>
            </>
          ) : (
            <span className="font-bold text-gray-900 text-lg">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(product.total_rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.total_rating.toFixed(1)})
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}