/* eslint-disable react-hooks/error-boundaries */
// components/products/random-products-server.tsx
import { getRandomProducts } from '@/lib/api/products'
import ProductCard from './product-card'
import Link from 'next/link'
import { Shuffle } from 'lucide-react'

export default async function RandomProductsServer() {
  try {
    const response = await getRandomProducts()
    const products = response.data

    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shuffle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Discover Random Picks</h2>
                <p className="text-gray-600 mt-1">
                  Handpicked selections just for you
                </p>
              </div>
            </div>
            <Link
              href="/products?sort=random"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Explore More
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
              <div className="text-gray-400 text-6xl mb-4">🎲</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products available
              </h3>
              <p className="text-gray-600">
                Check back later for new discoveries.
              </p>
            </div>
          )}
        </div>
      </section>
    )
  } catch (error) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Random Picks</h2>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <div className="text-blue-500 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Exploring Products
            </h3>
            <p className="text-blue-700">
              We&apos;re currently updating our random selections. Please check back soon.
            </p>
          </div>
        </div>
      </section>
    )
  }
}