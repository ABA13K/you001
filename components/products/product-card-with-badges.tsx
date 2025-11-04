// components/products/product-card-with-badges.tsx
'use client'

import { Product } from '@/types/product'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Zap, Trophy, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  showRatingBadge?: boolean
  showBestSellerBadge?: boolean
  rank?: number
}

export default function ProductCardWithBadges({ 
  product, 
  showRatingBadge = false,
  showBestSellerBadge = false,
  rank 
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const hasDiscount = parseFloat(product.discount_percentage) > 0
  const isTopRated = product.total_rating >= 4
  const discountAmount = hasDiscount 
    ? (parseFloat(product.original_price) - product.price_after_discount).toFixed(2)
    : 0

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsAddingToCart(false)
  }

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
      {/* Multiple Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            -{product.discount_percentage}%
          </div>
        )}
        
        {/* Top Rated Badge */}
        {showRatingBadge && isTopRated && (
          <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
            <Star size={10} className="mr-1 fill-current" />
            Top Rated
          </div>
        )}
        
        {/* Best Seller Badge */}
        {showBestSellerBadge && rank && rank <= 3 && (
          <div className={`px-2 py-1 rounded text-xs font-semibold flex items-center text-white ${
            rank === 1 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
            rank === 2 ? 'bg-gradient-to-r from-gray-500 to-gray-700' :
            'bg-gradient-to-r from-orange-400 to-red-500'
          }`}>
            <TrendingUp size={10} className="mr-1" />
            #{rank}
          </div>
        )}
      </div>

      {/* New Badge */}
      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
        <Zap size={10} className="mr-1" />
        NEW
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${
              isWishlisted ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="absolute bottom-2 left-2 right-2 bg-black text-white py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-50 flex items-center justify-center space-x-1 text-sm"
        >
          <ShoppingCart size={16} />
          <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors min-h-[3rem]">
          <Link href={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={`${
                  star <= Math.floor(product.total_rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.total_rating})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-gray-900">
                ${product.price_after_discount.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${product.original_price}
              </span>
              <span className="text-sm text-green-600 font-semibold">
                Save ${discountAmount}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ${product.original_price}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}