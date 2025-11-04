/* eslint-disable react-hooks/error-boundaries */
// components/products/top-rated-products-server.tsx
import { getTopRatedProducts } from '@/lib/api/products'
import ProductCard from './product-card'
import Link from 'next/link'
import { Trophy, Star } from 'lucide-react'

export default async function TopRatedProductsServer() {
  try {
    const response = await getTopRatedProducts()
    const products = response.data

    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Top Rated Products</h2>
                <p className="text-gray-600 mt-1">
                  Loved by our customers
                </p>
              </div>
            </div>
            <Link
              href="/products?sort=rating"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Top Rated
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  {/* Top Rated Badge */}
                  {product.total_rating >= 4 && (
                    <div className="absolute -top-2 -right-2 z-10 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                      <Star size={10} className="mr-1 fill-current" />
                      TOP
                    </div>
                  )}
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">⭐</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No top rated products yet
              </h3>
              <p className="text-gray-600">
                Be the first to rate our products!
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
              <h2 className="text-3xl font-bold text-gray-900">Top Rated Products</h2>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <div className="text-yellow-500 text-6xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Rating in Progress
            </h3>
            <p className="text-yellow-700">
              We&apos;re gathering customer ratings. Check back soon for top rated products.
            </p>
          </div>
        </div>
      </section>
    )
  }
}