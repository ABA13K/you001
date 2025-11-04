/* eslint-disable react-hooks/error-boundaries */
// components/products/top-selling-products-server.tsx
import { getTopSellingProducts } from '@/lib/api/products'
import ProductCard from './product-card'
import Link from 'next/link'
import { TrendingUp, Award } from 'lucide-react'

export default async function TopSellingProductsServer() {
  try {
    const response = await getTopSellingProducts()
    const products = response.data

    return (
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
                <p className="text-gray-600 mt-1">
                  Most popular among customers
                </p>
              </div>
            </div>
            <Link
              href="/products?sort=popular"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Best Sellers
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {products.map((product, index) => (
                <div key={product.id} className="relative">
                  {/* Best Seller Rank Badge */}
                  {index < 3 && (
                    <div className={`absolute -top-2 -left-2 z-10 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-r from-gray-500 to-gray-700' :
                      'bg-gradient-to-r from-orange-400 to-red-500'
                    }`}>
                      <Award size={10} className="mr-1" />
                      #{index + 1}
                    </div>
                  )}
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No best sellers yet
              </h3>
              <p className="text-gray-600">
                Discover our products and make them best sellers!
              </p>
            </div>
          )}
        </div>
      </section>
    )
  } catch (error) {
    return (
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 text-center">
            <div className="text-orange-500 text-6xl mb-4">📈</div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Tracking Popularity
            </h3>
            <p className="text-orange-700">
              We&apos;re analyzing sales data. Best sellers will be available soon.
            </p>
          </div>
        </div>
      </section>
    )
  }
}