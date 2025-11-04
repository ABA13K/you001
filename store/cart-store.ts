// store/cart-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, CartState } from '@/types/cart'

interface CartStore extends CartState {
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
    getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            itemCount: 0,

            addItem: (newItem: CartItem) => {
                set((state) => {
                    const existingItem = state.items.find(item => item.id === newItem.id)

                    if (existingItem) {
                        // Update quantity if item exists
                        const updatedItems = state.items.map(item =>
                            item.id === newItem.id
                                ? { ...item, quantity: item.quantity + newItem.quantity }
                                : item
                        )
                        const itemCount = updatedItems.reduce((total: number, item) => total + item.quantity, 0)
                        const total = updatedItems.reduce((sum: number, item) => sum + (item.price * item.quantity), 0)

                        return {
                            items: updatedItems,
                            itemCount,
                            total
                        }
                    } else {
                        // Add new item
                        const updatedItems = [...state.items, newItem]
                        const itemCount = updatedItems.reduce((total: number, item) => total + item.quantity, 0)
                        const total = updatedItems.reduce((sum: number, item) => sum + (item.price * item.quantity), 0)

                        return {
                            items: updatedItems,
                            itemCount,
                            total
                        }
                    }
                })
            },

            removeItem: (id: string) => {
                set((state) => {
                    const updatedItems = state.items.filter(item => item.id !== id)
                    const itemCount = updatedItems.reduce((total: number, item) => total + item.quantity, 0)
                    const total = updatedItems.reduce((sum: number, item) => sum + (item.price * item.quantity), 0)

                    return {
                        items: updatedItems,
                        itemCount,
                        total
                    }
                })
            },

            updateQuantity: (id: string, quantity: number) => {
                set((state) => {
                    if (quantity <= 0) {
                        // Remove item if quantity is 0 or less
                        const updatedItems = state.items.filter(item => item.id !== id)
                        const itemCount = updatedItems.reduce((total: number, item) => total + item.quantity, 0)
                        const total = updatedItems.reduce((sum: number, item) => sum + (item.price * item.quantity), 0)

                        return {
                            items: updatedItems,
                            itemCount,
                            total
                        }
                    }

                    const updatedItems = state.items.map(item =>
                        item.id === id ? { ...item, quantity } : item
                    )
                    const itemCount = updatedItems.reduce((total: number, item) => total + item.quantity, 0)
                    const total = updatedItems.reduce((sum: number, item) => sum + (item.price * item.quantity), 0)

                    return {
                        items: updatedItems,
                        itemCount,
                        total
                    }
                })
            },

            clearCart: () => {
                set({
                    items: [],
                    total: 0,
                    itemCount: 0
                })
            },

            getTotalPrice: () => {
                return get().items.reduce((total: number, item) => total + (item.price * item.quantity), 0)
            },

            getItemCount: () => {
                return get().items.reduce((total: number, item) => total + item.quantity, 0)
            }
        }),
        {
            name: 'cart-storage',
        }
    )
)