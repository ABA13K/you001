// types/auth.ts
export interface User {
    id: string
    name: string
    email: string
    phone: string // Changed from 'mobile' to 'phone' to match API
    birth_date: string
    gender: string
    address: string
    email_verified_at?: string
    created_at: string
    updated_at: string
}


export interface RegisterData {
    name: string
    mobile: string
    birth_date: string
    email: string
    password: string
    password_confirmation: string
    gender: string
    address: string
}

export interface LoginData {
    email: string
    password: string
}

export interface VerificationData {
    email: string
    recovery_code: string
}

export interface ForgotPasswordData {
    email: string
}

export interface ResetPasswordData {
    email: string
    recovery_code: string
    password: string
    confirm_password: string
}

// Update AuthResponse to match your API response
export interface AuthResponse {
    message: string
    data?: User
    token?: string
    token_type?: string
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    needsVerification: boolean
    verificationEmail: string | null
    isInitialized: boolean // Add this line
}
export interface AccountUpdateData {
    name?: string
    phone?: string // Changed from 'mobile' to 'phone'
    birth_date?: string
    gender?: string
    address?: string
    current_password?: string
    password?: string
    password_confirmation?: string
}

export interface Order {
    id: string
    order_number: string
    status: string
    total_amount: number
    item_count: number
    created_at: string
    updated_at: string
}

export interface OrderDetail {
    id: string
    order_number: string
    status: string
    total_amount: number
    items: OrderItem[]
    shipping_address: string
    created_at: string
    updated_at: string
}

export interface OrderItem {
    id: string
    product_name: string
    quantity: number
    price: number
    total: number
}
export interface VerificationData {
    email: string
    recovery_code: string
}