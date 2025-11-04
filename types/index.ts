// src/types/index.ts
export interface Product {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    images?: string[]
    category: string
    subcategory?: string
    rating: number
    reviewCount: number
    description: string
    shortDescription: string
    inStock: boolean
    stockQuantity: number
    tags: string[]
    features: string[]
    specifications: Record<string, string>
    createdAt: string
    updatedAt: string
}

export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    phone?: string
    address?: Address
    createdAt: string
}

export interface Address {
    id: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    isDefault: boolean
}

export interface Order {
    id: string
    userId: string
    items: OrderItem[]
    total: number
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    shippingAddress: Address
    paymentMethod: string
    createdAt: string
    updatedAt: string
}

export interface OrderItem {
    id: string
    product: Product
    quantity: number
    price: number
}

export interface Category {
    id: string
    name: string
    slug: string
    image: string
    description?: string
    parentId?: string
    children?: Category[]
}