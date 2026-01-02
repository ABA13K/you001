'use client';

import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
        {product.discount_percentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            -{product.discount_percentage}%
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // Handle favorite toggle
          }}
        >
          <svg
            className={`w-5 h-5 ${
              product.is_favorite ? 'text-red-500' : 'text-gray-400'
            }`}
            fill={product.is_favorite ? 'currentColor' : 'none'}
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
        
        <div className="flex items-center gap-2 mt-1">
          {product.discount_percentage > 0 ? (
            <>
              <span className="font-bold text-gray-900">
                ${parseFloat(product.price_after_discount).toFixed(2)}
              </span>
              <span className="text-sm line-through text-gray-500">
                ${parseFloat(product.original_price).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-bold text-gray-900">
              ${parseFloat(product.original_price).toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
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
          <span className="text-xs text-gray-500">({product.total_rating})</span>
        </div>
      </div>
    </Link>
  );
}