/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-auth-operations.ts
import { useCallback } from 'react'
import {
    registerUser,
    loginUser,
    verifyAccount,
    forgotPassword,
    resetPassword,
    logoutUser
} from '@/lib/api/auth'
import {
    RegisterData,
    LoginData,
    VerificationData,
    ForgotPasswordData,
    ResetPasswordData
} from '@/types/auth'
import { useAuth } from '@/context/auth-context'

export function useAuthOperations() {
    const { state, dispatch } = useAuth()

    const login = useCallback(async (loginData: LoginData) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        console.log('🚀 Starting login process...')

        try {
            const response = await loginUser(loginData)
            console.log('✅ Login API response:', response)

            // Check if we have user data and token in the response
            if (response.data && response.token) {
                // Save to localStorage
                localStorage.setItem('user', JSON.stringify(response.data))
                localStorage.setItem('token', response.token)
                console.log('✅ User data saved to localStorage')

                // Update auth state
                dispatch({ type: 'SET_USER', payload: response.data })
                dispatch({ type: 'SET_LOADING', payload: false })
                dispatch({ type: 'SET_ERROR', payload: null })
                console.log('✅ Auth state updated with user')

                return response
            } else {
                console.warn('⚠️ Login response missing user data or token:', response)
                throw new Error('Invalid response format from server')
            }
        } catch (error: any) {
            console.error('❌ Login error:', error)
            const message = error instanceof Error ? error.message : 'Login failed'
            dispatch({ type: 'SET_LOADING', payload: false })
            dispatch({ type: 'SET_ERROR', payload: message })
            throw error
        }
    }, [dispatch])

    // Also update the verify function
    const verify = useCallback(async (verificationData: VerificationData) => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            const response = await verifyAccount(verificationData)
            console.log('✅ Verification response:', response)

            if (response.data && response.token) {
                // Save to localStorage
                localStorage.setItem('user', JSON.stringify(response.data))
                localStorage.setItem('token', response.token)

                dispatch({ type: 'SET_USER', payload: response.data })
                dispatch({ type: 'SET_NEEDS_VERIFICATION', payload: false })
                dispatch({ type: 'SET_VERIFICATION_EMAIL', payload: null })
                dispatch({ type: 'SET_LOADING', payload: false })
            }

            return response
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Verification failed'
            dispatch({ type: 'SET_ERROR', payload: message })
            dispatch({ type: 'SET_LOADING', payload: false })
            throw error
        }
    }, [dispatch])

    // Update register function as well
    const register = useCallback(async (userData: RegisterData) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        console.log('🚀 Starting registration process...')

        try {
            const response = await registerUser(userData)
            console.log('✅ Registration API response:', response)

            dispatch({ type: 'SET_VERIFICATION_EMAIL', payload: userData.email })
            dispatch({ type: 'SET_NEEDS_VERIFICATION', payload: true })
            dispatch({ type: 'SET_LOADING', payload: false })
            console.log('✅ Registration successful, should redirect to verification')

            return response
        } catch (error) {
            console.error('❌ Registration error:', error)
            const message = error instanceof Error ? error.message : 'Registration failed'
            dispatch({ type: 'SET_ERROR', payload: message })
            dispatch({ type: 'SET_LOADING', payload: false }) // Add this missing line
            throw error
        }
    }, [dispatch])

    const forgot = useCallback(async (emailData: ForgotPasswordData) => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            const response = await forgotPassword(emailData)
            dispatch({ type: 'SET_LOADING', payload: false })
            return response
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to send recovery code'
            dispatch({ type: 'SET_ERROR', payload: message })
            throw error
        }
    }, [dispatch])

    const reset = useCallback(async (resetData: ResetPasswordData) => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            const response = await resetPassword(resetData)
            dispatch({ type: 'SET_LOADING', payload: false })
            return response
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Password reset failed'
            dispatch({ type: 'SET_ERROR', payload: message })
            throw error
        }
    }, [dispatch])

    const logout = useCallback(async () => {
        try {
            await logoutUser()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            // Clear localStorage
            localStorage.removeItem('user')
            localStorage.removeItem('token')

            dispatch({ type: 'LOGOUT' })
        }
    }, [dispatch])

    const clearError = useCallback(() => {
        dispatch({ type: 'SET_ERROR', payload: null })
    }, [dispatch])

    return {
        // State
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        needsVerification: state.needsVerification,
        verificationEmail: state.verificationEmail,
        isInitialized: state.isInitialized,

        // Actions
        register,
        verify,
        login,
        forgot,
        reset,
        logout,
        clearError,
    }
}