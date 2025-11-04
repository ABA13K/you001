// lib/api/products.ts
import { LatestProductsResponse } from '@/types/product'

const API_BASE_URL = 'https://aa-dev.site/you/api/public'

export async function getLatestProducts(): Promise<LatestProductsResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/home-page/products/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 } // Revalidate every hour
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: LatestProductsResponse = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching latest products:', error)
        throw new Error('Failed to fetch latest products')
    }
}