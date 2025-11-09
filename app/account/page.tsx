// app/account/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthOperations } from '@/hooks/use-auth-operations'
import { useAccount } from '@/hooks/use-account'
import ProfileForm from '@/components/account/profile-form'
import PasswordForm from '@/components/account/password-form'
import OrdersList from '@/components/account/orders-list'
import { User } from '@/types/auth'
import { 
  User as UserIcon, 
  Lock, 
  ShoppingBag, 
  LogOut,
  Loader2 
} from 'lucide-react'

type ActiveTab = 'profile' | 'password' | 'orders'

export default function AccountPage() {
  const router = useRouter()
  const { 
    user: authUser, 
    isAuthenticated, 
    isLoading: authLoading, 
    logout,
    isInitialized // Add this
  } = useAuthOperations()
  
  const { getProfile, isLoading: profileLoading } = useAccount()
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile')
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait until auth is initialized before checking authentication
    if (!isInitialized) {
      return
    }

    // Only redirect if we're sure user is not authenticated
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Load profile data if authenticated
    if (isAuthenticated && authUser) {
      loadUserProfile()
    }
  }, [isAuthenticated, authUser, router, isInitialized])

  const loadUserProfile = async () => {
    try {
      const profileData = await getProfile()
      setUser(profileData)
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  // Show loading while auth is being initialized
  if (!isInitialized || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" />
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show loading while fetching profile data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" />
          <p>Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon size={32} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Member since {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserIcon size={20} />
                  <span>Profile Information</span>
                </button>

                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === 'password'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Lock size={20} />
                  <span>Change Password</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingBag size={20} />
                  <span>My Orders</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'profile' && (
                <ProfileForm user={user} onUpdate={loadUserProfile} />
              )}

              {activeTab === 'password' && (
                <PasswordForm />
              )}

              {activeTab === 'orders' && (
                <OrdersList />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}