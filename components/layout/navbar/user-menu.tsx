// src/components/layout/navbar/user-menu.tsx
'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { User, Settings, LogOut, LogIn, UserPlus } from 'lucide-react'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/refs
    window.addEventListener('click', (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    })
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link
          href="/login"
          className="flex items-center space-x-1 px-3 py-2 text-sm hover:text-primary transition-colors"
        >
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </Link>
        <Link
          href="/signup"
          className="flex items-center space-x-1 px-3 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>Sign Up</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <User className="h-5 w-5" />
        <span className="text-sm font-medium">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          <Link
            href="/account/settings"
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" />
            <span>Account Settings</span>
          </Link>
          
          <Link
            href="/account/orders"
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4" />
            <span>My Orders</span>
          </Link>

          <div className="border-t border-gray-200 my-1"></div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}