// components/auth/verification-form.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthOperations } from '@/hooks/use-auth-operations'
import { Loader2 } from 'lucide-react'

export default function VerificationForm() {
  const router = useRouter()
  const { verify, isLoading, error, clearError, verificationEmail, needsVerification } = useAuthOperations()
  
  const [formData, setFormData] = useState({
    email: '',
    recovery_code: ''
  })
  const [isResending, setIsResending] = useState(false)

  // Set the email from context and check if verification is needed
  useEffect(() => {
    console.log('🔍 Verification Form State:', {
      verificationEmail,
      needsVerification,
      isLoading,
      error
    })

    // Set the email from context
    if (verificationEmail) {
      setFormData(prev => ({ ...prev, email: verificationEmail }))
    }

    // Redirect if no verification is needed
    if (!needsVerification) {
      console.log('ℹ️ No verification needed, redirecting to home...')
      router.push('/')
    }
  }, [verificationEmail, needsVerification, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📝 Verification form submitted:', formData)
    
    try {
      const result = await verify(formData)
      console.log('✅ Verification successful:', result)
      // The hook will handle the redirection on successful verification
    } catch (error) {
      console.error('💥 Verification failed:', error)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      // You'll need to implement a resend code API endpoint
      console.log('🔄 Resending verification code to:', formData.email)
      // await resendVerificationCode({ email: formData.email })
      alert('Verification code sent! Check your email.')
    } catch (error) {
      console.error('Failed to resend code:', error)
      alert('Failed to resend verification code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  if (!verificationEmail && !needsVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" />
          <p>Loading verification...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Verify Your Account</h2>
        
        <p className="text-gray-600 mb-6 text-center">
          We&apos;ve sent a verification code to<br />
          <strong>{verificationEmail}</strong>
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recovery_code" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code *
            </label>
            <input
              type="text"
              id="recovery_code"
              name="recovery_code"
              value={formData.recovery_code}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the 6-digit code"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the verification code sent to your email
            </p>
          </div>

          <input
            type="hidden"
            name="email"
            value={formData.email}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn&apos;t receive the code?{' '}
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/register')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to Register
          </button>
        </div>
      </div>
    </div>
  )
}