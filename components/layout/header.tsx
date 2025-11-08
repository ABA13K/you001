// components/layout/header.tsx
'use client'

import Link from 'next/link'
import SearchBar from '@/components/search/search-bar'
import CartIcon from '@/components/cart/cart-icon'
import { User, Heart, Menu } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900 flex-shrink-0">
            YourStore
          </Link>

          {/* Search Bar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/wishlist"
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Heart size={24} />
            </Link>
            
            <Link
              href="/account"
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <User size={24} />
            </Link>
            
            <CartIcon />
          </div>
        </div>

        {/* Mobile Search Bar - Visible only on mobile */}
        <div className="lg:hidden pb-4">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/products" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link 
                  href="/categories" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link 
                  href="/deals" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Deals
                </Link>
                <Link 
                  href="/about" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}