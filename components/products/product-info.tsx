// components/products/product-info.tsx
'use client'

import { useState } from 'react'
import { DetailedProduct } from '@/types/product'
import { Star, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import FavoriteButton from './favorite-button'

interface ProductInfoProps {
  product: DetailedProduct
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)

  const hasDiscount = product.discount_percentage > 0
  const discountAmount = hasDiscount 
    ? (parseFloat(product.original_price) - parseFloat(product.price_after_discount)).toFixed(2)
    : "0"

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(product.quantity, value))
    setQuantity(newQuantity)
  }

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{product.name}</h1>
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${
                    star <= Math.floor(product.total_rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.total_rating})</span>
          </div>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-green-600 font-medium">{product.sales_count} sold</span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-600">{product.sub_category_name}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-4">
        {hasDiscount ? (
          <>
            <span className="text-3xl font-bold text-gray-900">
              ${product.price_after_discount}
            </span>
            <span className="text-xl text-gray-500 line-through">
              ${product.original_price}
            </span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
              -{product.discount_percentage}%
            </span>
          </>
        ) : (
          <span className="text-3xl font-bold text-gray-900">
            ${product.original_price}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        {product.quantity > 0 ? (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-medium">In Stock</span>
            <span className="text-gray-500">({product.quantity} available)</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-600 font-medium">Out of Stock</span>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <FavoriteButton 
          productId={product.id_product.toString()} 
          size={24}
          className="p-3"
        />
        <button className="p-3 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
          <Share2 size={24} />
        </button>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-900">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            -
          </button>
          <span className="px-4 py-2 text-gray-900">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= product.quantity}
            className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        disabled={product.quantity === 0}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg"
      >
        {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>

      {/* Buy Now Button */}
      <button
        disabled={product.quantity === 0}
        className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg"
      >
        Buy Now
      </button>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Truck size={20} className="text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Free Shipping</p>
            <p className="text-xs text-gray-500">On orders over $50</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <RotateCcw size={20} className="text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">30-Day Returns</p>
            <p className="text-xs text-gray-500">Money back guarantee</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Shield size={20} className="text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">2-Year Warranty</p>
            <p className="text-xs text-gray-500">Manufacturer warranty</p>
          </div>
        </div>
      </div>
    </div>
  )
}