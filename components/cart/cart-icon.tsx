// components/cart/cart-icon.tsx
'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

// Mock cart data - replace with your actual cart store
const mockCartItems = 3

export default function CartIcon() {
  return (
    <Link href="/cart" className="relative p-2 hover:text-blue-600 transition-colors">
      <ShoppingCart className="w-6 h-6" />
      {mockCartItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {mockCartItems}
        </span>
      )}
    </Link>
  )
}