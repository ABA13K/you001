/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/search.ts
import { SearchResults, SearchParams, SearchFilters } from '@/types/search'

// Use relative URL for same-origin requests (no CORS issues)
const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? 'https://aa-dev.site/you/api/public'
    : 'https://aa-dev.site/you/api/public' // Use proxy in production

// Helper function to convert filters to URLSearchParams
function buildSearchParams(filters: Record<string, any>): URLSearchParams {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
        }
    })

    return params
}

// Main search function - uses proxy to avoid CORS
export async function searchProducts(params: SearchParams): Promise<SearchResults> {
    try {
        const { query, page = 1, limit = 12, filters = {} } = params

        // Build query parameters
        const searchParams = buildSearchParams({
            q: query,
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        })

        // Use proxy route in production, direct API in development
        const url = process.env.NODE_ENV === 'development'
            ? `https://aa-dev.site/you/api/public/products/filter?${searchParams.toString()}`
            : `https://aa-dev.site/you/api/public/products/filter?${searchParams.toString()}`

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        return {
            products: data.data || [],
            total: data.data?.length || 0,
            hasMore: data.data?.length === limit,
            currentPage: page,
            totalPages: Math.ceil((data.data?.length || 0) / limit)
        }
    } catch (error) {
        console.error('Error searching products:', error)
        throw new Error('Failed to search products')
    }
}

// Quick search for real-time results
export async function quickSearch(query: string, limit: number = 6) {
    try {
        if (!query.trim()) return []

        const searchParams = buildSearchParams({
            q: query,
            limit: limit.toString()
        })

        // Use proxy route in production, direct API in development
        const url = process.env.NODE_ENV === 'development'
            ? `https://aa-dev.site/you/api/public/products/filter?${searchParams.toString()}`
            : `https://aa-dev.site/you/api/public/products/filter?${searchParams.toString()}`

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 10 }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data.data || []
    } catch (error) {
        console.error('Error in quick search:', error)
        return []
    }
}

// Filter products with advanced filters
export async function filterProducts(filters: SearchFilters, page: number = 1, limit: number = 12): Promise<SearchResults> {
    try {
        // Build query parameters
        const searchParams = buildSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        })

        // Use proxy route in production, direct API in development
        const url = process.env.NODE_ENV === 'development'
            ? `https://aa-dev.site/you/api/public/products/filter?${searchParams.toString()}`
            : `https://aa-dev.site/you/api/public/products/filter?${searchParams.toString()}`

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        return {
            products: data.data || [],
            total: data.data?.length || 0,
            hasMore: data.data?.length === limit,
            currentPage: page,
            totalPages: Math.ceil((data.data?.length || 0) / limit)
        }
    } catch (error) {
        console.error('Error filtering products:', error)
        throw new Error('Failed to filter products')
    }
}

// Get categories for filter dropdown
export async function getCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/home-page/main-categorical`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data.data || []
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}