/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-search.ts
import { useState, useCallback, useRef } from 'react'
import { searchProducts, filterProducts, quickSearch } from '@/lib/api/search'
import { SearchParams, SearchFilters } from '@/types/search'

export function useSearchOperations() {
    const [state, setState] = useState({
        query: '',
        results: [] as any[],
        total: 0,
        loading: false,
        error: null as string | null,
        hasMore: false,
        filters: {},
        sortBy: 'relevance'
    })

    const [quickResults, setQuickResults] = useState<any[]>([])
    const [isQuickSearchLoading, setIsQuickSearchLoading] = useState(false)
    const searchTimeoutRef = useRef<number | null>(null)

    const performSearch = useCallback(async (params: SearchParams) => {
        setState(prev => ({ ...prev, loading: true, query: params.query }))

        try {
            const results = await searchProducts(params)
            setState(prev => ({
                ...prev,
                results: results.products,
                total: results.total,
                hasMore: results.hasMore,
                loading: false,
                error: null
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to search products'
            }))
        }
    }, [])

    const performFilter = useCallback(async (filters: SearchFilters, page: number = 1) => {
        setState(prev => ({ ...prev, loading: true }))

        try {
            const results = await filterProducts(filters, page)
            setState(prev => ({
                ...prev,
                results: results.products,
                total: results.total,
                hasMore: results.hasMore,
                loading: false,
                error: null
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to filter products'
            }))
        }
    }, [])

    const performQuickSearch = useCallback(async (query: string) => {
        // Clear existing timeout
        if (searchTimeoutRef.current !== null) {
            window.clearTimeout(searchTimeoutRef.current)
            searchTimeoutRef.current = null
        }

        // Clear results if query is too short
        if (query.length < 2) {
            setQuickResults([])
            setIsQuickSearchLoading(false)
            return
        }

        setIsQuickSearchLoading(true)

        // Debounce the API call - wait 300ms after user stops typing
        searchTimeoutRef.current = window.setTimeout(async () => {
            try {
                console.log('Performing real-time search for:', query)
                const results = await quickSearch(query)
                console.log('Real-time search results:', results)
                setQuickResults(results)
            } catch (error) {
                console.error('Quick search error:', error)
                setQuickResults([])
            } finally {
                setIsQuickSearchLoading(false)
                searchTimeoutRef.current = null
            }
        }, 300)
    }, [])

    const loadMore = useCallback(async (params: SearchParams) => {
        setState(prev => ({ ...prev, loading: true }))

        try {
            const nextPage = (params.page || 1) + 1
            const results = await searchProducts({ ...params, page: nextPage })
            setState(prev => ({
                ...prev,
                results: [...prev.results, ...results.products],
                loading: false
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to load more products'
            }))
        }
    }, [])

    const clearSearch = useCallback(() => {
        if (searchTimeoutRef.current !== null) {
            window.clearTimeout(searchTimeoutRef.current)
            searchTimeoutRef.current = null
        }

        setState({
            query: '',
            results: [],
            total: 0,
            loading: false,
            error: null,
            hasMore: false,
            filters: {},
            sortBy: 'relevance'
        })
        setQuickResults([])
        setIsQuickSearchLoading(false)
    }, [])

    const setFilters = useCallback((filters: any) => {
        setState(prev => ({ ...prev, filters }))
    }, [])

    const setSort = useCallback((sortBy: string) => {
        setState(prev => ({ ...prev, sortBy }))
    }, [])

    return {
        ...state,
        quickResults,
        isQuickSearchLoading,
        performSearch,
        performFilter,
        loadMore,
        performQuickSearch,
        clearSearch,
        setFilters,
        setSort
    }
}