// app/register/page.tsx
import RegisterForm from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <RegisterForm />
      </div>
    </div>
  )
}