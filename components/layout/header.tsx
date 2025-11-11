// components/layout/header.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { useFavorites } from '@/hooks/use-favorites'
import SearchBar from '@/components/search/search-bar'
import CartIcon from '@/components/cart/cart-icon'
import { User, LogOut, Settings, Heart, Menu } from 'lucide-react'

function UserMenu() {
  const { state, dispatch } = useAuth()

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{state.user.name}</p>
        <p className="text-xs text-gray-500">{state.user.email}</p>
      </div>
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
        {state.user.name.charAt(0).toUpperCase()}
      </div>
    </div>
  )
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { state } = useAuth()
  const { favorites, loadFavorites } = useFavorites()

  // Load favorites when user is authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      loadFavorites()
    }
  }, [state.isAuthenticated, loadFavorites])

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
            {/* Favorites Link - Only show for authenticated users */}
            {state.isAuthenticated && (
              <Link 
                href="/favorites" 
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors relative"
              >
                <Heart size={20} />
                <span className="hidden sm:inline">Favorites</span>
                {favorites.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-2 -right-2">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}
            
            {/* User Account Link */}
            {state.isAuthenticated ? (
              <Link
                href="/account"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="My Account"
              >
                <User size={24} />
              </Link>
            ) : (
              <UserMenu />
            )}
            
            {/* Cart Icon */}
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
                
                {/* Favorites in mobile menu */}
                {state.isAuthenticated && (
                  <Link 
                    href="/favorites" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart size={20} />
                   
                    {favorites.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                )}

                {!state.isAuthenticated && (
                  <>
                    <Link 
                      href="/login" 
                      className="text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/register" 
                      className="text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}