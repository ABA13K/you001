'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductVariantOption, ProductVariantsGroup } from '@/types/product';

interface VariantSelectorProps {
  variants: ProductVariantsGroup;
  basePrice: number;
  onVariantChange?: (selectedVariants: Record<string, ProductVariantOption>) => void;
}

export default function VariantSelector({ 
  variants, 
  basePrice,
  onVariantChange 
}: VariantSelectorProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariantOption>>({});

  if (!variants || Object.keys(variants).length === 0) {
    return null;
  }

  const handleVariantSelect = (variantType: string, option: ProductVariantOption) => {
    const newSelectedVariants = {
      ...selectedVariants,
      [variantType]: option
    };
    
    setSelectedVariants(newSelectedVariants);
    
    if (onVariantChange) {
      onVariantChange(newSelectedVariants);
    }
  };

  // Calculate total price with selected variants
  const calculateTotalPrice = () => {
    let total = basePrice;
    Object.values(selectedVariants).forEach(variant => {
      total += parseFloat(variant.extra_price);
    });
    return total.toFixed(2);
  };

  // Get variant type label
  const getVariantTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'Color': 'Color',
      'Upholstery': 'Upholstery',
      'Package': 'Package',
      'Size': 'Size',
      'Material': 'Material'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {Object.entries(variants).map(([variantType, options]) => (
        <div key={variantType} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{getVariantTypeLabel(variantType)}</h3>
            {selectedVariants[variantType] && (
              <span className="text-sm text-gray-500">
                Selected: {selectedVariants[variantType].value}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            {options.map((option) => {
              const isSelected = selectedVariants[variantType]?.id === option.id;
              const isOutOfStock = option.quantity <= 0;
              const extraPrice = parseFloat(option.extra_price);
              
              return (
                <button
                  key={option.id}
                  onClick={() => !isOutOfStock && handleVariantSelect(variantType, option)}
                  disabled={isOutOfStock}
                  className={`
                    relative flex flex-col items-center p-3 border rounded-lg transition-all min-w-[120px]
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                    ${isOutOfStock 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer'
                    }
                  `}
                  title={isOutOfStock ? 'Out of stock' : option.value}
                >
                  {/* Out of Stock Overlay */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center rounded-lg z-10">
                      <span className="text-xs font-medium text-gray-600 bg-white/90 px-2 py-1 rounded">
                        Sold Out
                      </span>
                    </div>
                  )}
                  
                  {/* Variant Image for Color */}
                  {variantType === 'Color' && option.images.length > 0 && (
                    <div className="relative w-16 h-16 mb-2 rounded-full overflow-hidden border border-gray-200">
                      <Image
                        src={option.images[0]}
                        alt={option.value}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  
                  {/* Color Swatch (if no image) */}
                  {variantType === 'Color' && option.images.length === 0 && (
                    <div 
                      className="w-16 h-16 mb-2 rounded-full border border-gray-200"
                      style={{ backgroundColor: option.value.toLowerCase().includes('white') ? '#ffffff' : 
                               option.value.toLowerCase().includes('black') ? '#000000' :
                               option.value.toLowerCase().includes('blue') ? '#0000ff' :
                               option.value.toLowerCase().includes('red') ? '#ff0000' :
                               option.value.toLowerCase().includes('silver') ? '#c0c0c0' :
                               option.value.toLowerCase().includes('brown') ? '#8B4513' :
                               option.value.toLowerCase().includes('beige') ? '#F5F5DC' :
                               option.value.toLowerCase().includes('navy') ? '#000080' : '#f3f4f6' }}
                    />
                  )}
                  
                  {/* Variant Name */}
                  <span className="font-medium text-sm text-center">{option.value}</span>
                  
                  {/* Extra Price */}
                  {extraPrice !== 0 && (
                    <span className={`text-xs mt-1 ${extraPrice > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {extraPrice > 0 ? `+$${extraPrice.toFixed(2)}` : `-$${Math.abs(extraPrice).toFixed(2)}`}
                    </span>
                  )}
                  
                  {/* Stock Status */}
                  {option.quantity > 0 && option.quantity < 10 && (
                    <div className="mt-1">
                      <span className="text-xs text-yellow-600">
                        Only {option.quantity} left
                      </span>
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
        </div>
      ))}
      
      {/* Selected Variants Summary */}
      {Object.keys(selectedVariants).length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">Selected Options:</h4>
          <div className="space-y-2">
            {Object.entries(selectedVariants).map(([type, option]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="text-gray-600">{getVariantTypeLabel(type)}:</span>
                <div className="text-right">
                  <span className="font-medium">{option.value}</span>
                  {parseFloat(option.extra_price) !== 0 && (
                    <span className={`ml-2 ${parseFloat(option.extra_price) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(option.extra_price) > 0 ? `+$${option.extra_price}` : `-$${Math.abs(parseFloat(option.extra_price))}`}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {/* Total Price */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between font-medium">
                <span>Total Price:</span>
                <span className="text-lg">${calculateTotalPrice()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}