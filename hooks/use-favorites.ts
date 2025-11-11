/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-favorites.ts
import { useState, useCallback } from 'react'
import { addToFavorites, getFavorites, removeFromFavorites, checkIsFavorite } from '@/lib/api/favorites'
import { FavoriteItem } from '@/types/favorite'

export function useFavorites() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Load all favorites
    const loadFavorites = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await getFavorites()
            setFavorites(response.data || [])
            return response.data
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load favorites'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Add to favorites
    const addFavorite = useCallback(async (productId: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await addToFavorites(productId)

            // Reload favorites to get updated list
            await loadFavorites()

            return response
        } catch (err: any) {
            const message = err instanceof Error ? err.message : 'Failed to add to favorites'

            // Don't show error for "already in favorites" - it's not really an error
            if (err.message?.includes('already in favorites')) {
                console.log('Product already in favorites')
            } else {
                setError(message)
            }
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [loadFavorites])

    // Remove from favorites
    const removeFavorite = useCallback(async (productId: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await removeFromFavorites(productId)

            // Update local state immediately for better UX
            setFavorites(prev => prev.filter(item => item.product.id !== productId))

            return response
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to remove from favorites'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Check if product is favorite
    const isProductFavorite = useCallback(async (productId: string): Promise<boolean> => {
        try {
            const response = await checkIsFavorite(productId)
            return response.is_favorite
        } catch (err) {
            console.error('Error checking favorite status:', err)
            return false
        }
    }, [])

    // Toggle favorite status
    const toggleFavorite = useCallback(async (productId: string) => {
        try {
            const isCurrentlyFavorite = favorites.some(item => item.product.id === productId)

            if (isCurrentlyFavorite) {
                await removeFavorite(productId)
                return { action: 'removed' as const }
            } else {
                await addFavorite(productId)
                return { action: 'added' as const }
            }
        } catch (error) {
            throw error
        }
    }, [favorites, addFavorite, removeFavorite])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return {
        favorites,
        isLoading,
        error,
        loadFavorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isProductFavorite,
        clearError,
    }
}