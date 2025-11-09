// lib/api/account.ts
import { AccountUpdateData, Order, OrderDetail } from '@/types/auth'

const API_BASE_URL = 'https://aa-dev.site/you/api'

async function accountFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')

    if (!token) {
        throw new Error('No authentication token found')
    }

    try {
        const url = `${API_BASE_URL}${endpoint}`
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
            ...options,
        })

        const data = await response.json()
        console.log(`🔑 API Response from ${endpoint}:`, data)

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        return data
    } catch (error) {
        console.error(`Account API error at ${endpoint}:`, error)
        throw error
    }
}

// Get user profile
export async function getUserProfile() {
    return accountFetch('/profile')
}

// Update user profile
export async function updateProfile(profileData: AccountUpdateData) {
    return accountFetch('/edit-profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    })
}

// Change password
export async function changePassword(passwordData: {
    current_password: string
    password: string
    password_confirmation: string
}) {
    return accountFetch('/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
    })
}

// Get user orders (if available)
export async function getUserOrders(): Promise<{ orders: Order[] }> {
    return accountFetch('/user/orders')
}

// Get order details (if available)
export async function getOrderDetail(orderId: string): Promise<{ order: OrderDetail }> {
    return accountFetch(`/user/orders/${orderId}`)
}