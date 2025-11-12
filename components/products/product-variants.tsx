/* eslint-disable @typescript-eslint/no-explicit-any */
// components/products/product-variants.tsx
import type { ProductVariants } from '@/types/product'

interface ProductVariantsProps {
  variants: ProductVariants
}

export default function ProductVariants({ variants }: ProductVariantsProps) {
  return (
    <div className="space-y-6">
      {Object.entries(variants).map(([variantType, variantOptions]) => (
        <div key={variantType}>
          <h4 className="text-sm font-medium text-gray-900 mb-3 capitalize">{variantType}</h4>
          <div className="flex flex-wrap gap-2">
            {variantOptions.map((option:any) => (
              <div
                key={option.id}
                className="border border-gray-300 rounded-lg p-3 min-w-[120px]"
              >
                <div className="text-sm font-medium text-gray-900">{option.value}</div>
                {parseFloat(option.extra_price) > 0 && (
                  <div className="text-sm text-green-600">+${option.extra_price}</div>
                )}
                <div className="text-xs text-gray-500">{option.quantity} available</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
