/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-search.ts
import { useState, useCallback } from 'react'
import { searchProducts, filterProducts, quickSearch } from '@/lib/api/search'
import { SearchParams, SearchFilters } from '@/types/search'
import { useSearch } from '@/context/search-context'

export function useSearchOperations() {
    const { state, dispatch } = useSearch()
    const [quickResults, setQuickResults] = useState<any[]>([])

    const performSearch = useCallback(async (params: SearchParams) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'SET_QUERY', payload: params.query })

        try {
            const results = await searchProducts(params)
            dispatch({ type: 'SET_RESULTS', payload: results })
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to search products' })
        }
    }, [dispatch])

    const performFilter = useCallback(async (filters: SearchFilters, page: number = 1) => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            const results = await filterProducts(filters, page)
            dispatch({ type: 'SET_RESULTS', payload: results })
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to filter products' })
        }
    }, [dispatch])

    const loadMore = useCallback(async (params: SearchParams) => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            const nextPage = (params.page || 1) + 1
            const results = await searchProducts({ ...params, page: nextPage })
            dispatch({ type: 'LOAD_MORE', payload: results.products })
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load more products' })
        }
    }, [dispatch])

    const performQuickSearch = useCallback(async (query: string) => {
        if (query.length < 2) {
            setQuickResults([])
            return
        }

        try {
            const results = await quickSearch(query)
            setQuickResults(results)
        } catch (error) {
            console.error('Quick search error:', error)
            setQuickResults([])
        }
    }, [])

    const clearSearch = useCallback(() => {
        dispatch({ type: 'SET_QUERY', payload: '' })
        dispatch({ type: 'SET_RESULTS', payload: { products: [], total: 0, hasMore: false, currentPage: 1, totalPages: 0 } })
        setQuickResults([])
    }, [dispatch])

    return {
        query: state.query,
        results: state.results,
        total: state.total,
        loading: state.loading,
        error: state.error,
        hasMore: state.hasMore,
        quickResults,
        performSearch,
        performFilter,
        loadMore,
        performQuickSearch,
        clearSearch,
        setFilters: (filters: any) => dispatch({ type: 'SET_FILTERS', payload: filters }),
        setSort: (sortBy: string) => dispatch({ type: 'SET_SORT', payload: sortBy })
    }
}