// components/products/product-gallery.tsx
'use client'

import { useState } from 'react'
import { ProductVariants } from '@/types/product'
import { Play, ZoomIn } from 'lucide-react'

interface ProductGalleryProps {
  mainImage: string
  images: string[]
  variants: ProductVariants
}

export default function ProductGallery({ mainImage, images, variants }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  // Combine all images: main + additional + variant images
  const allImages = [mainImage, ...images]
  
  // Get variant images if a variant is selected
  const variantImages = selectedVariant 
    ? Object.values(variants).flat().find(v => v.value === selectedVariant)?.images || []
    : []

  const displayImages = [...allImages, ...variantImages]

  const isVideo = (url: string) => url.toLowerCase().endsWith('.mp4')

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {isVideo(selectedImage) ? (
          <video 
            src={selectedImage} 
            controls 
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={selectedImage}
            alt="Product main"
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-110' : 'scale-100'
            }`}
          />
        )}
        
        {!isVideo(selectedImage) && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded">
            <ZoomIn size={20} />
          </div>
        )}
        
        {isVideo(selectedImage) && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded">
            <Play size={20} />
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 ${
                selectedImage === image ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              {isVideo(image) ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Play size={16} className="text-gray-600" />
                </div>
              ) : (
                <img
                  src={image}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Variant Selection */}
      {variants.color && variants.color.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Color</h4>
          <div className="flex flex-wrap gap-2">
            {variants.color.map((color) => (
              <button
                key={color.id}
                onClick={() => {
                  setSelectedVariant(color.value)
                  // Set first variant image as selected if available
                  if (color.images.length > 0) {
                    setSelectedImage(color.images[0])
                  }
                }}
                className={`px-3 py-2 text-sm border rounded-md ${
                  selectedVariant === color.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {color.value}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}