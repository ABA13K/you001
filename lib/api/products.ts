// lib/api/products.ts
import {
    LatestProductsResponse,
    RandomProductsResponse,
    TopRatedProductsResponse,
    TopSellingProductsResponse
} from '@/types/product'

const API_BASE_URL = 'https://aa-dev.site/you/api/public'

async function fetchProducts<T>(endpoint: string): Promise<T> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 } // Revalidate every hour
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: T = await response.json()
        return data
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error)
        throw new Error(`Failed to fetch from ${endpoint}`)
    }
}

export async function getLatestProducts(): Promise<LatestProductsResponse> {
    return fetchProducts<LatestProductsResponse>('/home-page/products/latest')
}

export async function getRandomProducts(): Promise<RandomProductsResponse> {
    return fetchProducts<RandomProductsResponse>('/home-page/products/random')
}

export async function getTopRatedProducts(): Promise<TopRatedProductsResponse> {
    return fetchProducts<TopRatedProductsResponse>('/home-page/products/top-rated')
}

export async function getTopSellingProducts(): Promise<TopSellingProductsResponse> {
    return fetchProducts<TopSellingProductsResponse>('/home-page/products/top-selling')
}