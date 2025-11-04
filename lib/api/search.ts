/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/search.ts
import { SearchResults, SearchParams, SearchFilters } from '@/types/search'

const API_BASE_URL = 'https://aa-dev.site/you/api/public'

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

// Search products by query
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

        const response = await fetch(`${API_BASE_URL}/products/search?${searchParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 }
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

// Filter products with advanced filters
export async function filterProducts(filters: SearchFilters, page: number = 1, limit: number = 12): Promise<SearchResults> {
    try {
        // Build query parameters
        const searchParams = buildSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        })

        const response = await fetch(`${API_BASE_URL}/products/filter?${searchParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 }
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

// Quick search for header/search bar
export async function quickSearch(query: string, limit: number = 5) {
    try {
        if (!query.trim()) return []

        const searchParams = buildSearchParams({
            q: query,
            limit: limit.toString()
        })

        const response = await fetch(`${API_BASE_URL}/products/search?${searchParams.toString()}`, {
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
        console.error('Error in quick search:', error)
        return []
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