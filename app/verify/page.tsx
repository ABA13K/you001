// app/verify/page.tsx
import VerificationForm from '@/components/auth/verification-form'

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <VerificationForm />
      </div>
    </div>
  )
}