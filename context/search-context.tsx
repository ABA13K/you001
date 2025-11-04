/* eslint-disable @typescript-eslint/no-explicit-any */
// context/search-context.tsx
'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { SearchParams, SearchResults, SearchProduct } from '@/types/search'

interface SearchState {
  query: string
  results: SearchProduct[]
  total: number
  loading: boolean
  error: string | null
  hasMore: boolean
  filters: any
  sortBy: string
}

type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESULTS'; payload: SearchResults }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_MORE'; payload: SearchProduct[] }
  | { type: 'SET_FILTERS'; payload: any }
  | { type: 'SET_SORT'; payload: string }

const initialState: SearchState = {
  query: '',
  results: [],
  total: 0,
  loading: false,
  error: null,
  hasMore: false,
  filters: {},
  sortBy: 'relevance'
}

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload.products,
        total: action.payload.total,
        hasMore: action.payload.hasMore,
        loading: false,
        error: null
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'LOAD_MORE':
      return {
        ...state,
        results: [...state.results, ...action.payload],
        loading: false
      }
    case 'SET_FILTERS':
      return { ...state, filters: action.payload }
    case 'SET_SORT':
      return { ...state, sortBy: action.payload }
    default:
      return state
  }
}

const SearchContext = createContext<{
  state: SearchState
  dispatch: React.Dispatch<SearchAction>
} | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState)

  return (
    <SearchContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}