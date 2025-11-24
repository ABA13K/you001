// components/categories/main-categories-client.tsx
'use client'

import { useState, useEffect } from 'react'
import { getMainCategories } from '@/lib/api/categories'
import Image from 'next/image'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  image: string
  products_count: number
}

export default function MainCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getMainCategories()
        setCategories(response.data)
      } catch (err) {
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Loading categories...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="aspect-square mb-6 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">{error}</h3>
            <p className="text-red-600">
              Please try refreshing the page or check your connection.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover products from our main categories with immersive 3D experience
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group block text-center relative"
            >
              {/* Same 3D card structure as above */}
              <div className="relative aspect-square mb-6 overflow-hidden rounded-2xl transition-all duration-700 ease-out group-hover:duration-300">
                <div className="relative w-full h-full transition-all duration-700 ease-out group-hover:scale-105 group-hover:rotate-3">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-cyan-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                  
                  {/* 3D Card */}
                  <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-blue-500/25 border border-white/50">
                    {/* Lighting effects */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl opacity-60" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/5 to-transparent rounded-b-2xl" />
                    
                    {/* Image container */}
                    <div className="relative w-full h-full p-4">
                      <div className="relative w-full h-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-45 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-12 z-10">
                      {category.products_count}
                    </div>
                  </div>

                  {/* Shadow */}
                  <div className="absolute inset-0 bg-black/20 rounded-2xl blur-md -z-10 transition-all duration-500 ease-out group-hover:blur-lg group-hover:scale-95 group-hover:translate-y-4" />
                </div>
              </div>

              {/* Text */}
              <div className="transition-all duration-500 ease-out group-hover:translate-y-2">
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300 relative inline-block">
                  {category.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-500 ease-out" />
                </h3>
                <p className="text-sm text-gray-500 mt-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  Explore collection
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}