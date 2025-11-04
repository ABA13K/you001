// app/products/page.tsx
'use client'

import { useState } from 'react'
import ProductsFilter from '@/components/products/products-filter'
import ProductsGrid from '@/components/products/products-grid'

interface FilterState {
  priceRange: { min: number; max: number }
  categories: string[]
  sortBy: string
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 10000 },
    categories: [],
    sortBy: 'featured'
  })

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    // Here you would typically fetch products based on the new filters
    console.log('Filters changed:', newFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <div className="flex">
          {/* Sidebar Filters */}
          <div className="w-80 flex-shrink-0">
            <ProductsFilter onFiltersChange={handleFiltersChange} />
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            <ProductsGrid products={[]} />
          </div>
        </div>
      </div>
    </div>
  )
}