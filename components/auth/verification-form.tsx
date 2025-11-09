/* eslint-disable react-hooks/set-state-in-effect */
// components/auth/verification-form.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthOperations } from '@/hooks/use-auth-operations'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function VerificationForm() {
  const router = useRouter()
  const { verify, verificationEmail, isLoading, error, clearError } = useAuthOperations()
  
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (verificationEmail) {
      setEmail(verificationEmail)
    }
  }, [verificationEmail])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    setCode(value)
    
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      clearError()
      return
    }

    try {
      await verify({ email, recovery_code: code })
      // User will be automatically logged in and redirected
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleBack = () => {
    router.back()
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

      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Verify Your Account</h2>
      <p className="text-gray-600 text-center mb-6">
        Enter the verification code sent to your email
      </p>

      {email && (
        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md mb-4 text-center">
          Code sent to: <strong>{email}</strong>
        </p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Verification Code *
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={handleChange}
            required
            maxLength={8}
            className="w-full px-3 py-3 text-center text-lg font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            placeholder="Enter 8-digit code"
            style={{ letterSpacing: '0.5em' }}
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            Enter the 8-digit code sent to your email
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !code}
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
            onClick={() => router.push('/register')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Try again
          </button>
        </p>
      </div>
    </div>
  )
}