import {
    RegisterData,
    LoginData,
    VerificationData,
    ForgotPasswordData,
    ResetPasswordData,
    AuthResponse,
    ForgotPasswordResponse,
    ResetPasswordResponse,
    ErrorResponse
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aa-dev.site/you/api';

export const authApi = {
    // 1) Register
    register: async (data: RegisterData, locale: 'ar' | 'en' = 'en'): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/register/${locale}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error: ErrorResponse = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        return response.json();
    },

    // 2) Account Verification
    verifyAccount: async (data: VerificationData, locale: 'ar' | 'en' = 'en'): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/account-verification/${locale}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error: ErrorResponse = await response.json();
            throw new Error(error.message || 'Verification failed');
        }

        return response.json();
    },

    // 3) Login
    login: async (data: LoginData, locale: 'ar' | 'en' = 'en'): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/login/${locale}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Check if it's a 401 (needs verification)
            if (response.status === 401) {
                const error: ErrorResponse = await response.json();
                throw new Error('NEEDS_VERIFICATION:' + error.message);
            }

            const error: ErrorResponse = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    },

    // 4) Find email for forgot password
    forgotPassword: async (data: ForgotPasswordData, locale: 'ar' | 'en' = 'en'): Promise<ForgotPasswordResponse> => {
        const response = await fetch(`${API_BASE_URL}/find-email/${locale}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error: ErrorResponse = await response.json();
            throw new Error(error.message || 'Failed to send recovery code');
        }

        return response.json();
    },

    // 5) Update/Reset password
    resetPassword: async (data: ResetPasswordData, locale: 'ar' | 'en' = 'en'): Promise<ResetPasswordResponse> => {
        const response = await fetch(`${API_BASE_URL}/update-password/${locale}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error: ErrorResponse = await response.json();
            throw new Error(error.message || 'Failed to reset password');
        }

        return response.json();
    },

    // Logout (client-side only)
    logout: (): void => {
        // Remove token and user from localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },
};