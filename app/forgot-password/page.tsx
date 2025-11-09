// app/forgot-password/page.tsx
import ForgotPasswordForm from '@/components/auth/forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}