// types/index.ts
export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    slug: string
}

export interface Product {
    id: number
    name: string
    price: number
    originalPrice?: number
    image: string
    category: string
    rating: number
    reviewCount: number
    isNew?: boolean
    isBestSeller?: boolean
    isFeatured?: boolean
    slug: string
}

export interface CartState {
    items: CartItem[]
    total: number
    itemCount: number
}