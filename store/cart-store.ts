// src/store/cart-store.ts
import { Product } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
    id: string
    product: Product
    quantity: number
}

interface CartStore {
    items: CartItem[]
    addItem: (product: Product) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    total: number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,

            addItem: (product) => {
                const { items } = get()
                const existingItem = items.find(item => item.id === product.id)

                if (existingItem) {
                    get().updateQuantity(product.id, existingItem.quantity + 1)
                } else {
                    set({
                        items: [...items, { id: product.id, product, quantity: 1 }]
                    })
                }
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter(item => item.id !== productId)
                })
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId)
                    return
                }

                set({
                    items: get().items.map(item =>
                        item.id === productId ? { ...item, quantity } : item
                    )
                })
            },

            clearCart: () => set({ items: [] })
        }),
        {
            name: 'cart-storage'
        }
    )
)