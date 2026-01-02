'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  mainImage?: string;
  variants?: Array<{
    id: number;
    name: string;
    image: string;
  }>;
}

export default function ProductGallery({ 
  images, 
  mainImage, 
  variants 
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    mainImage || images[0] || ''
  );

  const displayImages = images.length > 0 ? images : 
    ['https://via.placeholder.com/600x600?text=No+Image'];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt="Product image"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
      </div>
      
      {/* Thumbnail Images */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                selectedImage === image
                  ? 'border-blue-500'
                  : 'border-transparent'
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Variants (if provided) */}
      {variants && variants.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Available Variants</h3>
          <div className="flex gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedImage(variant.image)}
                className="px-4 py-2 border rounded-lg hover:border-blue-500 transition-colors"
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}