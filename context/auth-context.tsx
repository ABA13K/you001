// context/auth-context.tsx
'use client'

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { User, AuthState } from '@/types/auth'

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NEEDS_VERIFICATION'; payload: boolean }
  | { type: 'SET_VERIFICATION_EMAIL'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'SET_INITIALIZED' }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with true
  error: null,
  needsVerification: false,
  verificationEmail: null,
  isInitialized: false,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null }
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
        needsVerification: false,
        isInitialized: true
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_NEEDS_VERIFICATION':
      return { ...state, needsVerification: action.payload, isLoading: false }
    case 'SET_VERIFICATION_EMAIL':
      return { ...state, verificationEmail: action.payload }
    case 'LOGOUT':
      return { 
        ...initialState,
        isInitialized: true // Keep initialized true on logout
      }
    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: true,
        isLoading: false
      }
    default:
      return state
  }
}

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
}>({
  state: initialState,
  dispatch: () => null
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        
        console.log('🔍 Checking localStorage for auth data...')
        console.log('📁 User in localStorage:', savedUser ? 'Exists' : 'None')
        console.log('🔑 Token in localStorage:', token ? 'Exists' : 'None')
        
        if (savedUser && token) {
          const user = JSON.parse(savedUser)
          console.log('✅ Found user in localStorage, setting auth state:', user)
          dispatch({ type: 'SET_USER', payload: user })
        } else {
          console.log('ℹ️ No auth data in localStorage, marking as initialized')
          dispatch({ type: 'SET_INITIALIZED' })
        }
      } catch (error) {
        console.error('❌ Error loading user from storage:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        dispatch({ type: 'SET_INITIALIZED' })
      }
    }

    loadUser()
  }, [])

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}