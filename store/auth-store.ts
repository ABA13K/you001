// src/store/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
    id: string
    name: string
    email: string
    avatar?: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<boolean>
    signup: (name: string, email: string, password: string) => Promise<boolean>
    logout: () => void
    updateProfile: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                // Simulate API call
                try {
                    // Replace with actual API call
                    const mockUser: User = {
                        id: '1',
                        name: 'John Doe',
                        email: email,
                    }

                    set({ user: mockUser, isAuthenticated: true })
                    return true
                } catch (error) {
                    console.error('Login failed:', error)
                    return false
                }
            },

            signup: async (name: string, email: string, password: string) => {
                // Simulate API call
                try {
                    const mockUser: User = {
                        id: '1',
                        name,
                        email,
                    }

                    set({ user: mockUser, isAuthenticated: true })
                    return true
                } catch (error) {
                    console.error('Signup failed:', error)
                    return false
                }
            },

            logout: () => {
                set({ user: null, isAuthenticated: false })
            },

            updateProfile: (userData: Partial<User>) => {
                const { user } = get()
                if (user) {
                    set({ user: { ...user, ...userData } })
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
)