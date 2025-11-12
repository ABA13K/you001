/* eslint-disable react-hooks/error-boundaries */
// components/categories/main-categories-server.tsx
import { getMainCategories } from '@/lib/api/categories'
import Image from 'next/image'
import Link from 'next/link'

export default async function MainCategoriesServer() {
  try {
    const response = await getMainCategories()
    const categories = response.data

    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-600 mt-2">
              Discover products from our main categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="group text-center"
              >
                <div className="relative aspect-square mb-4 overflow-hidden rounded-full bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                  {/* Optional overlay for better image contrast */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.products_count} {category.products_count === 1 ? 'product' : 'products'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  } catch (error) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Failed to load categories
            </h3>
            <p className="text-red-600">
              Please try refreshing the page or check your connection.
            </p>
          </div>
        </div>
      </section>
    )
  }
}