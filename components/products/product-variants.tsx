'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductVariant } from '@/types/product';

interface ProductVariantsProps {
  variants: ProductVariant[];
  onSelectVariant?: (variant: ProductVariant) => void;
  selectedVariantId?: number;
  showImages?: boolean;
  showStock?: boolean;
  variantType?: string; // e.g., 'Color', 'Size', 'Style'
}

export default function ProductVariants({
  variants,
  onSelectVariant,
  selectedVariantId,
  showImages = true,
  showStock = true,
  variantType = 'Variant'
}: ProductVariantsProps) {
  const [selectedId, setSelectedId] = useState<number | undefined>(selectedVariantId);

  if (!variants || variants.length === 0) {
    return null;
  }

  const handleSelect = (variant: ProductVariant) => {
    setSelectedId(variant.id);
    if (onSelectVariant) {
      onSelectVariant(variant);
    }
  };

  // Group variants by common properties for better display
  const groupedVariants = variants.reduce((groups, variant) => {
    const key = Object.entries(variant.properties)
      .map(([k, v]) => `${k}:${v}`)
      .sort()
      .join('|');
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(variant);
    return groups;
  }, {} as Record<string, ProductVariant[]>);

  const displayVariants = Object.values(groupedVariants).map(group => group[0]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{variantType}</h3>
        {selectedId && (
          <span className="text-sm text-gray-500">
            {displayVariants.find(v => v.id === selectedId)?.name || 'Select a variant'}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3">
        {displayVariants.map((variant) => {
          const isSelected = selectedId === variant.id;
          const isOutOfStock = variant.stock <= 0;
          
          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && handleSelect(variant)}
              disabled={isOutOfStock}
              className={`
                relative flex flex-col items-center p-3 border rounded-lg transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' 
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${isOutOfStock 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
                }
              `}
              title={isOutOfStock ? 'Out of stock' : variant.name}
            >
              {/* Out of Stock Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center rounded-lg z-10">
                  <span className="text-xs font-medium text-gray-600 bg-white/90 px-2 py-1 rounded">
                    Sold Out
                  </span>
                </div>
              )}
              
              {/* Variant Image */}
              {showImages && variant.image && (
                <div className="relative w-20 h-20 mb-2">
                  <Image
                    src={variant.image}
                    alt={variant.name}
                    fill
                    className="object-cover rounded"
                    sizes="80px"
                  />
                </div>
              )}
              
              {/* Variant Name */}
              <span className="font-medium text-sm text-center">{variant.name}</span>
              
              {/* Variant Price */}
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm font-medium text-gray-900">
                  ${parseFloat(variant.price).toFixed(2)}
                </span>
              </div>
              
              {/* Stock Status */}
              {showStock && variant.stock > 0 && (
                <div className="mt-1">
                  <span className="text-xs text-green-600">
                    {variant.stock < 10 ? `Only ${variant.stock} left` : 'In Stock'}
                  </span>
                </div>
              )}
              
              {/* Properties */}
              {variant.properties && Object.keys(variant.properties).length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-1 max-w-[140px]">
                  {Object.entries(variant.properties).map(([key, value]) => (
                    <span
                      key={`${key}-${value}`}
                      className="px-1.5 py-0.5 text-xs bg-gray-100 rounded"
                      title={`${key}: ${value}`}
                    >
                      {value}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Selected Variant Details */}
      {selectedId && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Selected {variantType}:</h4>
          {(() => {
            const selectedVariant = variants.find(v => v.id === selectedId);
            if (!selectedVariant) return null;
            
            return (
              <div className="text-sm text-gray-600">
                <p><strong>Name:</strong> {selectedVariant.name}</p>
                <p><strong>Price:</strong> ${parseFloat(selectedVariant.price).toFixed(2)}</p>
                <p><strong>Stock:</strong> {selectedVariant.stock} units available</p>
                {selectedVariant.properties && Object.keys(selectedVariant.properties).length > 0 && (
                  <div className="mt-2">
                    <strong>Properties:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(selectedVariant.properties).map(([key, value]) => (
                        <span key={key} className="px-2 py-1 bg-white rounded border text-xs">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}