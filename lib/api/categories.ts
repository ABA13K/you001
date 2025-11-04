// lib/api/categories.ts
import { CategoriesResponse } from '@/types/category'

const API_BASE_URL = 'https://aa-dev.site/you/api/public'

export async function getMainCategories(): Promise<CategoriesResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/home-page/main-categorical`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Add cache configuration if needed
            next: { revalidate: 3600 } // Revalidate every hour
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: CategoriesResponse = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching categories:', error)
        throw new Error('Failed to fetch categories')
    }
}