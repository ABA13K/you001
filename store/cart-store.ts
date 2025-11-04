// store/cart-store.ts
import { create } from 'zustand'

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    slug: string
}

interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    addItem: (newItem: CartItem) => {
        set((state) => {
            const existingItem = state.items.find(item => item.id === newItem.id)

            if (existingItem) {
                const updatedItems = state.items.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                )
                return { items: updatedItems }
            }

            return { items: [...state.items, newItem] }
        })
    },

    removeItem: (id: string) => {
        set((state) => ({
            items: state.items.filter(item => item.id !== id)
        }))
    },

    updateQuantity: (id: string, quantity: number) => {
        set((state) => {
            if (quantity <= 0) {
                return {
                    items: state.items.filter(item => item.id !== id)
                }
            }

            return {
                items: state.items.map(item =>
                    item.id === id ? { ...item, quantity } : item
                )
            }
        })
    },

    clearCart: () => {
        set({ items: [] })
    },

    getTotalItems: (): number => {
        const { items } = get()
        return items.reduce((total: number, item: CartItem) => total + item.quantity, 0)
    }
}))