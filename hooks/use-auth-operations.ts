/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api/auth';
import {
    RegisterData,
    LoginData,
    VerificationData,
    ForgotPasswordData,
    ResetPasswordData
} from '@/types/auth';

export const useAuthOperations = () => {
    const {
        setUser,
        setToken,
        setAuthenticated,
        setLoading,
        setError,
        clearError,
        user,
        token,
        isAuthenticated,
        isLoading,
        error
    } = useAuthStore();

    const [operationLoading, setOperationLoading] = useState(false);

    const register = async (data: RegisterData, locale: 'ar' | 'en' = 'en') => {
        setOperationLoading(true);
        clearError();

        try {
            const response = await authApi.register(data, locale);

            // Store email for verification
            localStorage.setItem('pending_verification_email', data.email);

            return response;
        } catch (error: any) {
            setError(error.message || 'Registration failed');
            throw error;
        } finally {
            setOperationLoading(false);
        }
    };

    const verifyAccount = async (data: VerificationData, locale: 'ar' | 'en' = 'en') => {
        setOperationLoading(true);
        clearError();

        try {
            const response = await authApi.verifyAccount(data, locale);

            // Update auth store
            setUser(response.data);
            setToken(response.token);
            setAuthenticated(true);

            // Clear pending email
            localStorage.removeItem('pending_verification_email');

            return response;
        } catch (error: any) {
            setError(error.message || 'Verification failed');
            throw error;
        } finally {
            setOperationLoading(false);
        }
    };

    const login = async (data: LoginData, locale: 'ar' | 'en' = 'en') => {
        setOperationLoading(true);
        clearError();

        try {
            const response = await authApi.login(data, locale);

            // Update auth store
            setUser(response.data);
            setToken(response.token);
            setAuthenticated(true);

            return response;
        } catch (error: any) {
            const message = error.message || 'Login failed';
            setError(message);

            // Check if needs verification
            if (message.includes('NEEDS_VERIFICATION:')) {
                // Store email for verification
                localStorage.setItem('pending_verification_email', data.email);
            }

            throw error;
        } finally {
            setOperationLoading(false);
        }
    };

    const forgotPassword = async (data: ForgotPasswordData, locale: 'ar' | 'en' = 'en') => {
        setOperationLoading(true);
        clearError();

        try {
            const response = await authApi.forgotPassword(data, locale);

            // Store email for reset
            localStorage.setItem('reset_password_email', data.email);

            return response;
        } catch (error: any) {
            setError(error.message || 'Failed to send recovery code');
            throw error;
        } finally {
            setOperationLoading(false);
        }
    };

    const resetPassword = async (data: ResetPasswordData, locale: 'ar' | 'en' = 'en') => {
        setOperationLoading(true);
        clearError();

        try {
            const response = await authApi.resetPassword(data, locale);

            // Clear reset email
            localStorage.removeItem('reset_password_email');

            return response;
        } catch (error: any) {
            setError(error.message || 'Failed to reset password');
            throw error;
        } finally {
            setOperationLoading(false);
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
        setToken(null);
        setAuthenticated(false);
    };

    return {
        // Operations
        register,
        verifyAccount,
        login,
        forgotPassword,
        resetPassword,
        logout,
        clearError,

        // Loading states
        operationLoading,
        isLoading,

        // Auth state
        user,
        token,
        isAuthenticated,
        error,

        // Helper functions
        getPendingVerificationEmail: () => localStorage.getItem('pending_verification_email'),
        getResetPasswordEmail: () => localStorage.getItem('reset_password_email'),
    };
};