// types/search.ts
export interface SearchProduct {
    id: number
    name: string
    original_price: string
    image: string
    // Optional fields that might be available
    discount_percentage?: string
    price_after_discount?: number
    total_rating?: number
    category?: string
}

export interface SearchResults {
    products: SearchProduct[]
    total: number
    hasMore: boolean
    currentPage: number
    totalPages: number
}

export interface SearchFilters {
    q?: string
    min_price?: number
    max_price?: number
    main_category_id?: number
    sub_category_id?: number
    date_from?: string
    date_to?: string
    sort_by?: string
}

export interface SearchParams {
    query: string
    page?: number
    limit?: number
    filters?: SearchFilters
}