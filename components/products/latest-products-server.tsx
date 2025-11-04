/* eslint-disable react-hooks/error-boundaries */
// components/products/latest-products-server.tsx
import { getLatestProducts } from '@/lib/api/products'
import ProductCard from './product-card'
import Link from 'next/link'

export default async function LatestProductsServer() {
  try {
    const response = await getLatestProducts()
    const products = response.data

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
  } catch (error) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Products</h2>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Temporary Unavailable
            </h3>
            <p className="text-yellow-700">
              We&apos;re having trouble loading the latest products. Please check back soon.
            </p>
          </div>
        </div>
      </section>
    )
  }
}