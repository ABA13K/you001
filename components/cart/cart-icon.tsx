// components/cart/cart-icon.tsx
'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'

export default function CartIcon() {
  const { items } = useCartStore()
  const itemCount = items.reduce((total: number, item) => total + item.quantity, 0)

  return (
    <Link href="/cart" className="relative p-2 hover:text-primary transition-colors">
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  )
}