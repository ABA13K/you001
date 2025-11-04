// types/cart.ts
export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    slug: string
}

export interface CartState {
    items: CartItem[]
    total: number
    itemCount: number
}