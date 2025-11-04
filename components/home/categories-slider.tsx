// components/home/categories-slider.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const categories = [
  {
    id: 1,
    name: 'Electronics',
    image: '/images/categories/electronics.jpg',
    slug: 'electronics',
    productCount: 234
  },
  {
    id: 2,
    name: 'Fashion',
    image: '/images/categories/fashion.jpg',
    slug: 'fashion',
    productCount: 567
  },
  {
    id: 3,
    name: 'Home & Garden',
    image: '/images/categories/home-garden.jpg',
    slug: 'home-garden',
    productCount: 189
  },
  {
    id: 4,
    name: 'Sports',
    image: '/images/categories/sports.jpg',
    slug: 'sports',
    productCount: 145
  },
  {
    id: 5,
    name: 'Beauty',
    image: '/images/categories/beauty.jpg',
    slug: 'beauty',
    productCount: 278
  },
  {
    id: 6,
    name: 'Toys',
    image: '/images/categories/toys.jpg',
    slug: 'toys',
    productCount: 167
  },
  {
    id: 7,
    name: 'Books',
    image: '/images/categories/books.jpg',
    slug: 'books',
    productCount: 432
  },
  {
    id: 8,
    name: 'Automotive',
    image: '/images/categories/automotive.jpg',
    slug: 'automotive',
    productCount: 98
  }
]

export default function CategoriesSlider() {
  const [startIndex, setStartIndex] = useState(0)
  const visibleCategories = 6

  const next = () => {
    setStartIndex(prev => 
      prev + visibleCategories >= categories.length ? 0 : prev + 1
    )
  }

  const prev = () => {
    setStartIndex(prev => 
      prev === 0 ? categories.length - visibleCategories : prev - 1
    )
  }

  const visibleItems = categories.slice(startIndex, startIndex + visibleCategories)

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <div className="flex space-x-2">
            <button
              onClick={prev}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {visibleItems.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className="group text-center"
            >
              <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.productCount} products</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}