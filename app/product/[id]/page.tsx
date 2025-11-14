// app/product/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useProduct } from '@/hooks/use-product'
import ProductGallery from '@/components/products/product-gallery'
import ProductInfo from '@/components/products/product-info'
import ProductProperties from '@/components/products/product-properties'
import ProductVariants from '@/components/products/product-variants'
import SimilarProducts from '@/components/products/similar-products'
import { Loader2 } from 'lucide-react'
import CommentsSection from '@/components/products/comments-section'

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const { product, similarProducts, isLoading, error, fetchProduct } = useProduct()

  useEffect(() => {
    if (productId) {
      fetchProduct(productId)
    }
  }, [productId, fetchProduct])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" />
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>Product not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Gallery */}
            <div>
              <ProductGallery 
                mainImage={product.main_image}
                images={product.images}
                variants={product.variants}
              />
            </div>

            {/* Product Info */}
            <div>
              <ProductInfo product={product} />
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
<div className="border-b border-gray-200">
  <nav className="flex -mb-px">
    <button className="border-b-2 border-blue-500 text-blue-600 py-4 px-6 text-sm font-medium">
      Description
    </button>
    <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-6 text-sm font-medium">
      Specifications
    </button>
    <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-6 text-sm font-medium">
      Reviews ({product.total_rating > 0 ? 'Some' : '0'})
    </button>
  </nav>
</div>
          <div className="p-6">
            {/* Description */}
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>

            {/* Properties */}
            {product.properties && product.properties.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <ProductProperties properties={product.properties} />
              </div>
            )}

            {/* Variants */}
            {product.variants && Object.keys(product.variants).length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Options</h3>
                <ProductVariants variants={product.variants} />
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-8">
            <SimilarProducts products={similarProducts} />
          </div>
        )}
        {/* Add Comments Section */}
<div className="mt-8">
  <CommentsSection 
    productId={productId} 
    productName={product.name} 
  />
</div>
      </div>
    </div>
  )
}