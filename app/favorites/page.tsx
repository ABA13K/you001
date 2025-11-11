// app/favorites/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFavorites } from '@/hooks/use-favorites'
import { useAuthOperations } from '@/hooks/use-auth-operations'
import { Heart, Trash2, ShoppingBag, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  const router = useRouter()
  const { favorites, isLoading, error, removeFavorite, loadFavorites } = useFavorites()
  const { isAuthenticated, isInitialized } = useAuthOperations()

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (isAuthenticated) {
      loadFavorites()
    }
  }, [isAuthenticated, isInitialized, router, loadFavorites])

  const handleRemoveFavorite = async (productId: string, productName: string) => {
    if (confirm(`Remove ${productName} from favorites?`)) {
      try {
        await removeFavorite(productId)
      } catch (error) {
        console.error('Failed to remove favorite:', error)
      }
    }
  }

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" />
          <p>Loading favorites...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Heart size={24} className="text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
                <p className="text-gray-600">{favorites.length} items</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">Products you add to favorites will appear here.</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <ShoppingBag size={16} className="mr-2" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <div key={item.favorite_id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFavorite(item.product.id, item.product.name)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      {item.product.discount_percentage > 0 ? (
                        <>
                          <span className="text-lg font-bold text-gray-900">
                            ${item.product.price_after_discount}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${item.product.original_price}
                          </span>
                          <span className="text-sm bg-red-100 text-red-600 px-1 rounded">
                            -{item.product.discount_percentage}%
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ${item.product.original_price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700 transition-colors"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}