// app/verify/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthOperations } from '@/hooks/use-auth-operations'
import { Loader2 } from 'lucide-react'

export default function VerifyPage() {
  const router = useRouter()
  const { verificationEmail, needsVerification, isAuthenticated } = useAuthOperations()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log('🔍 Verify Page State:', {
      verificationEmail,
      needsVerification,
      isAuthenticated
    })

    // Redirect if no verification needed
    if (!needsVerification && isAuthenticated) {
      router.push('/')
    }
    
    if (!needsVerification && !verificationEmail) {
      router.push('/register')
    }
  }, [needsVerification, verificationEmail, isAuthenticated, router])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add verification logic here
  }

  if (!verificationEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Account</h2>
        <p className="text-gray-600 mb-6">
          We sent a verification code to {verificationEmail}
        </p>
        
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter verification code"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Account'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}