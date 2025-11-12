// components/products/product-properties.tsx
import { ProductProperty } from '@/types/product'

interface ProductPropertiesProps {
  properties: ProductProperty[]
}

export default function ProductProperties({ properties }: ProductPropertiesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {properties.map((property, index) => (
        <div key={index} className="flex border-b border-gray-100 py-2">
          <span className="text-sm font-medium text-gray-500 w-1/3">{property.key}:</span>
          <span className="text-sm text-gray-900 w-2/3">{property.value}</span>
        </div>
      ))}
    </div>
  )
}