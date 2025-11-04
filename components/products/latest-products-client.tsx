// components/products/latest-products-client.tsx
'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types/product'
import ProductCard from './product-card'
import Link from 'next/link'

export default function LatestProductsClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLatestProducts() {
      try {
        setLoading(true)
        const response = await fetch('/api/products/latest')
        const data = await response.json()
        
        if (response.ok) {
          setProducts(data.data)
        } else {
          setError(data.message || 'Failed to fetch products')
        }
      } catch (err) {
        setError('Network error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchLatestProducts()
  }, [])

  if (loading) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Products</h2>
              <p className="text-gray-600 mt-2">Discover our newest arrivals</p>
            </div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Products</h2>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Failed to Load
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest Products</h2>
            <p className="text-gray-600 mt-2">
              Discover our newest arrivals
            </p>
          </div>
          <Link
            href="/products?sort=newest"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            View All
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products available
            </h3>
            <p className="text-gray-600">
              Check back later for new arrivals.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}