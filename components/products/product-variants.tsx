/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProductVariant } from '@/types/product';

interface ProductVariantsProps {
  variants: ProductVariant[];
  onSelectVariant?: (variantId: number) => void;
  selectedVariantId?: number;
}

export default function ProductVariants({
  variants,
  onSelectVariant,
  selectedVariantId
}: ProductVariantsProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  const handleSelect = (variantId: number) => {
    if (onSelectVariant) {
      onSelectVariant(variantId);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Available Variants</h3>
      
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          
          return (
            <button
              key={variant.id}
              onClick={() => handleSelect(variant.id)}
              className={`
                flex flex-col items-center p-3 border rounded-lg transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              {/* Variant Image */}
              {variant.image && (
                <div className="relative w-16 h-16 mb-2">
                  <img
                    src={variant.image}
                    alt={variant.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
              
              {/* Variant Name */}
              <span className="font-medium text-sm">{variant.name}</span>
              
              {/* Variant Price */}
              <span className="text-sm text-gray-600 mt-1">
                ${parseFloat(variant.price).toFixed(2)}
              </span>
              
              {/* Stock Status */}
              <div className="mt-1">
                {variant.stock > 0 ? (
                  <span className="text-xs text-green-600">
                    In Stock ({variant.stock})
                  </span>
                ) : (
                  <span className="text-xs text-red-600">Out of Stock</span>
                )}
              </div>
              
              {/* Properties */}
              {variant.properties && Object.keys(variant.properties).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {Object.entries(variant.properties).map(([key, value]) => (
                    <span
                      key={`${key}-${value}`}
                      className="px-2 py-1 text-xs bg-gray-100 rounded"
                    >
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}