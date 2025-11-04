// src/components/cart/cart-icon.tsx
'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cart-store'
import { ShoppingCart } from 'lucide-react'

export default function CartIcon() {
  const { items } = useCartStore()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Link href="/cart" className="relative p-2 hover:text-primary transition-colors">
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  )
}