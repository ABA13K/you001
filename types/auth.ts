export interface User {
    id: number;
    role_id: number;
    name: string;
    email: string;
    phone: string;
    gender: 'male' | 'female';
    birth_date: string;
    address: string;
    email_verified_at: string | null;
    language: 'ar' | 'en';
}

export interface RegisterData {
    name: string;
    mobile: string;
    birth_date: string;
    email: string;
    password: string;
    password_confirmation: string;
    gender: 'male' | 'female';
    address: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface VerificationData {
    email: string;
    recovery_code: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    email: string;
    recovery_code: string;
    password: string;
    confirm_password: string;
}

export interface AuthResponse {
    message: string;
    data: User;
    token: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordResponse {
    message: string;
    data?: User;
}

export interface ErrorResponse {
    message: string;
    errors?: string[];
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}