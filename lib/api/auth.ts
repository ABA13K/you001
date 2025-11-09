/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/auth.ts
import {
    RegisterData,
    LoginData,
    VerificationData,
    ForgotPasswordData,
    ResetPasswordData,
    AuthResponse,
    User
} from '@/types/auth'

const API_BASE_URL = 'https://aa-dev.site/you/api'

// Helper function for API calls
async function authFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
        const url = `${API_BASE_URL}${endpoint}`

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
            ...options,
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        return data
    } catch (error) {
        console.error(`Auth API error at ${endpoint}:`, error)
        throw error
    }
}

// Register new user
export async function loginUser(loginData: LoginData): Promise<AuthResponse> {
    const response = await authFetch('/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
    })

    console.log('🔑 Raw login response:', response)

    // The response already matches AuthResponse interface
    return response
}

// Register new user
export async function registerUser(userData: RegisterData): Promise<AuthResponse> {
    const response = await authFetch('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    })

    console.log('🔑 Raw register response:', response)
    return response
}

// Verify account
export async function verifyAccount(verificationData: VerificationData): Promise<AuthResponse> {
    const response = await authFetch('/account-verification', {
        method: 'POST',
        body: JSON.stringify(verificationData),
    })

    console.log('🔑 Raw verification response:', response)
    return response
}

// Forgot password - send recovery code
export async function forgotPassword(emailData: ForgotPasswordData): Promise<{ message: string }> {
    return authFetch('/find-email', {
        method: 'POST',
        body: JSON.stringify(emailData),
    })
}

// Reset password with recovery code
export async function resetPassword(resetData: ResetPasswordData): Promise<{ message: string }> {
    return authFetch('/update-password', {
        method: 'PUT',
        body: JSON.stringify(resetData),
    })
}

// Logout user (if you have a logout endpoint)
export async function logoutUser(): Promise<{ message: string }> {
    return authFetch('/logout', {
        method: 'POST',
    })
}

// Get current user (if you have a user endpoint)
export async function getCurrentUser(): Promise<{ user: User }> {
    return authFetch('/user', {
        method: 'GET',
    })
}