// lib/api/favorites.ts
import { FavoritesResponse } from '@/types/favorite'

const API_BASE_URL = 'https://aa-dev.site/you/api'

async function favoritesFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')

    if (!token) {
        throw new Error('No authentication token found')
    }

    try {
        const url = `${API_BASE_URL}${endpoint}`
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
            ...options,
        })

        const data = await response.json()
        console.log(`🔑 Favorites API Response from ${endpoint}:`, data)

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        return data
    } catch (error) {
        console.error(`Favorites API error at ${endpoint}:`, error)
        throw error
    }
}

// Add product to favorites
export async function addToFavorites(productId: string): Promise<{ message: string }> {
    return favoritesFetch('/favorites', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
    })
}

// Get all favorites
export async function getFavorites(): Promise<FavoritesResponse> {
    return favoritesFetch('/favorites')
}

// Remove product from favorites
export async function removeFromFavorites(productId: string): Promise<{ message: string }> {
    return favoritesFetch(`/favorites/${productId}`, {
        method: 'DELETE',
    })
}

// Check if product is in favorites
export async function checkIsFavorite(productId: string): Promise<{ is_favorite: boolean }> {
    // You might need to create this endpoint or derive from getFavorites
    try {
        const favorites = await getFavorites()
        const isFavorite = favorites.data.some(item => item.product.id === productId)
        return { is_favorite: isFavorite }
    } catch (error) {
        console.error('Error checking favorite status:', error)
        return { is_favorite: false }
    }
}