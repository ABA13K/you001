// hooks/use-account.ts
import { useState, useCallback } from 'react'
import {
    getUserProfile,
    updateProfile,
    changePassword,
    getUserOrders,
    getOrderDetail
} from '@/lib/api/account'
import { AccountUpdateData, Order, OrderDetail, User } from '@/types/auth'

export function useAccount() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getProfile = useCallback(async (): Promise<User> => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await getUserProfile()
            return response.data
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch profile'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateUserProfile = useCallback(async (profileData: AccountUpdateData) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await updateProfile(profileData)
            return response
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update profile'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updatePassword = useCallback(async (passwordData: {
        current_password: string
        password: string
        password_confirmation: string
    }) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await changePassword(passwordData)
            return response
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to change password'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    const getOrders = useCallback(async (): Promise<Order[]> => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await getUserOrders()
            return response.orders || []
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch orders'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    const getOrderDetails = useCallback(async (orderId: string): Promise<OrderDetail> => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await getOrderDetail(orderId)
            return response.order
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch order details'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return {
        isLoading,
        error,
        getProfile,
        updateUserProfile,
        updatePassword,
        getOrders,
        getOrderDetails,
        clearError,
    }
}