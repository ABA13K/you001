// components/products/favorite-button.tsx
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

  // Update favorite status when favorites list changes
  useEffect(() => {
    const favoriteStatus = favorites.some(item => item.product.id === productId)
    setIsFavorite(favoriteStatus)
  }, [favorites, productId])

  const handleToggleFavorite = async () => {
    if (isLoadingState) return
    
    setIsLoadingState(true)
    try {
      await toggleFavorite(productId)
      // State will update automatically via the useEffect
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setIsLoadingState(false)
    }
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading || isLoadingState}
      className={`p-2 rounded-full transition-colors ${
        isFavorite 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-400'
      } ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        size={size} 
        className={isFavorite ? 'fill-current' : ''}
      />
    </button>
  )
}