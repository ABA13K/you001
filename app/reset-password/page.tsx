// app/reset-password/page.tsx
import ResetPasswordForm from '@/components/auth/reset-password-form'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <ResetPasswordForm />
      </div>
    </div>
  )
}