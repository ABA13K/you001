// components/products/favorite-button.tsx - Optimistic version
'use client'

import { useState, useEffect } from 'react'
import { useFavorites } from '@/hooks/use-favorites'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  productId: string
  size?: number
  className?: string
}

export default function FavoriteButton({ productId, size = 20, className = '' }: FavoriteButtonProps) {
  const { toggleFavorite, favorites, isLoading } = useFavorites()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoadingState, setIsLoadingState] = useState(false)
  const [optimisticFavorite, setOptimisticFavorite] = useState<boolean | null>(null)

  // Update favorite status when favorites list changes
  useEffect(() => {
    const favoriteStatus = favorites.some(item => item.product.id === productId)
    console.log(`🔍 FavoriteButton ${productId}:`, { 
      isFavorite, 
      favoriteStatus, 
      optimisticFavorite,
      favoritesCount: favorites.length
    })
    setIsFavorite(favoriteStatus)
    // Reset optimistic state when real data updates
    if (optimisticFavorite !== null && optimisticFavorite === favoriteStatus) {
      setOptimisticFavorite(null)
    }
  }, [favorites, productId])

  const handleToggleFavorite = async () => {
    if (isLoadingState) return
    
    console.log(`❤️ Toggling favorite for product ${productId}, current state:`, isFavorite)
    
    // Optimistic update - immediately change UI
    const newFavoriteState = !isFavorite
    setOptimisticFavorite(newFavoriteState)
    setIsLoadingState(true)
    
    try {
      const result = await toggleFavorite(productId)
      console.log(`✅ Favorite toggled successfully:`, result)
    } catch (error) {
      console.error('❌ Failed to toggle favorite:', error)
      // Revert optimistic update on error
      setOptimisticFavorite(null)
    } finally {
      setIsLoadingState(false)
    }
  }

  // Use optimistic state if available, otherwise use real state
  const displayFavorite = optimisticFavorite !== null ? optimisticFavorite : isFavorite

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading || isLoadingState}
      className={`p-2 rounded-full transition-colors ${
        displayFavorite 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-400'
      } ${isLoadingState ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={displayFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        size={size} 
        className={displayFavorite ? 'fill-current' : ''}
      />
      {isLoadingState && (
        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-full" />
      )}
    </button>
  )
}