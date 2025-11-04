// components/products/category-filter.tsx
'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  productCount: number
}

interface CategoryFilterProps {
  categories: Category[]
  onCategoryChange: (categories: string[]) => void
}

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', productCount: 156 },
  { id: '2', name: 'Clothing', productCount: 234 },
  { id: '3', name: 'Home & Garden', productCount: 189 },
  { id: '4', name: 'Sports', productCount: 97 },
  { id: '5', name: 'Beauty', productCount: 145 },
  { id: '6', name: 'Books', productCount: 203 },
  { id: '7', name: 'Toys', productCount: 87 },
  { id: '8', name: 'Automotive', productCount: 65 }
]

export default function CategoryFilter({ 
  categories = mockCategories, 
  onCategoryChange 
}: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleCategoryChange = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    
    setSelectedCategories(newSelected)
    onCategoryChange(newSelected)
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Categories</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {categories.map((category) => (
          <label key={category.id} className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {category.name}
              </span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {category.productCount}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}