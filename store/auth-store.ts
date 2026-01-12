import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types/auth';

interface AuthStore extends AuthState {
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setAuthenticated: (isAuthenticated: boolean) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),

            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false,
                error: null,
            }),

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);