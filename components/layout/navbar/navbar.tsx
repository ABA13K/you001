// src/components/layout/navbar/navbar.tsx
import Link from 'next/link'
import SearchBar from './search-bar'
import UserMenu from './user-menu'
import CartIcon from '@/components/cart/cart-icon'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            E-Shop
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Navigation Links & Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/favorites" className="p-2 hover:text-primary">
              ♥ Favorites
            </Link>
            <CartIcon />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}