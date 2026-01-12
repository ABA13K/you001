/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  register: (data: any, locale?: 'ar' | 'en') => Promise<void>;
  verifyAccount: (data: any, locale?: 'ar' | 'en') => Promise<void>;
  login: (data: any, locale?: 'ar' | 'en') => Promise<void>;
  forgotPassword: (data: any, locale?: 'ar' | 'en') => Promise<void>;
  resetPassword: (data: any, locale?: 'ar' | 'en') => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Save auth to localStorage when state changes
  useEffect(() => {
    if (state.token && state.user) {
      localStorage.setItem('auth_token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  }, [state.token, state.user]);

  const register = async (data: any, locale: 'ar' | 'en' = 'en') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(`/api/auth/register?locale=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      // Registration successful, but user needs verification
      // Store email for verification page
      localStorage.setItem('pending_verification_email', data.email);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
      throw error;
    }
  };

  const verifyAccount = async (data: any, locale: 'ar' | 'en' = 'en') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(`/api/auth/verify?locale=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Verification failed');
      }

      // Verification successful, set auth state
      setState({
        user: result.data,
        token: result.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Clear pending verification email
      localStorage.removeItem('pending_verification_email');
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      }));
      throw error;
    }
  };

  const login = async (data: any, locale: 'ar' | 'en' = 'en') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(`/api/auth/login?locale=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle needs verification case
        if (response.status === 401 && result.message?.includes('verification')) {
          throw new Error('NEEDS_VERIFICATION:' + result.message);
        }
        throw new Error(result.message || 'Login failed');
      }

      // Login successful
      setState({
        user: result.data,
        token: result.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const forgotPassword = async (data: any, locale: 'ar' | 'en' = 'en') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(`/api/auth/forgot-password?locale=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send recovery code');
      }

      // Store email for password reset page
      localStorage.setItem('reset_password_email', data.email);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send recovery code',
      }));
      throw error;
    }
  };

  const resetPassword = async (data: any, locale: 'ar' | 'en' = 'en') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(`/api/auth/reset-password?locale=${locale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to reset password');
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: null,
      }));

      // Clear reset email
      localStorage.removeItem('reset_password_email');
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to reset password',
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value = {
    ...state,
    register,
    verifyAccount,
    login,
    forgotPassword,
    resetPassword,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}