// components/products/price-filter.tsx
'use client'

import { useState } from 'react'

interface PriceFilterProps {
  onPriceChange: (min: number, max: number) => void
}

const priceRanges = [
  { label: 'All Prices', min: 0, max: 10000 },
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: 'Over $200', min: 200, max: 10000 }
]

export default function PriceFilter({ onPriceChange }: PriceFilterProps) {
  const [selectedRange, setSelectedRange] = useState<number>(0)

  const handlePriceChange = (index: number) => {
    setSelectedRange(index)
    const range = priceRanges[index]
    onPriceChange(range.min, range.max)
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Price Range</h3>
      <div className="space-y-2">
        {priceRanges.map((range, index) => (
          <label key={range.label} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="price-range"
              checked={selectedRange === index}
              onChange={() => handlePriceChange(index)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{range.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}