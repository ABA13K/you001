// components/products/product-card.tsx
'use client'

import { Product } from '@/types/product'
import Link from 'next/link'
import { Star, Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    // Add to cart logic here
    setIsAddingToCart(false)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const hasDiscount = parseFloat(product.discount_percentage) > 0
  const discountAmount = hasDiscount 
    ? (parseFloat(product.original_price) - product.price_after_discount).toFixed(2)
    : 0

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            -{product.discount_percentage}%
          </div>
        )}

        {/* New Badge - You can add logic for new products */}
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
          New
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlist}
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