// components/ui/product-card.tsx
'use client'

import Image from 'next/image'
import { Star, Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  isNew?: boolean
  isBestSeller?: boolean
  isFeatured?: boolean
  slug: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.isNew && (
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Best Seller
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${
            isWishlisted ? 'text-red-500' : 'text-gray-600'
          }`}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={`${
                  star <= Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}