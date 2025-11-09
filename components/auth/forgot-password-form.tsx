// components/auth/forgot-password-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthOperations } from '@/hooks/use-auth-operations'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordForm() {
  const router = useRouter()
  const { forgot, isLoading, error, clearError } = useAuthOperations()
  
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await forgot({ email })
      setIsSubmitted(true)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleBack = () => {
    router.back()
  }

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            A confirmation code has been sent to <strong>{email}</strong>
          </p>
          <button
            onClick={() => router.push('/reset-password')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enter Recovery Code
          </button>
          <button
            onClick={handleBack}
            className="w-full mt-3 text-gray-600 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <button
        onClick={handleBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Forgot Password</h2>
      <p className="text-gray-600 text-center mb-6">
        Enter your email address and we&apos;ll send you a recovery code
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Sending Code...
            </>
          ) : (
            'Send Recovery Code'
          )}
        </button>
      </form>
    </div>
  )
}