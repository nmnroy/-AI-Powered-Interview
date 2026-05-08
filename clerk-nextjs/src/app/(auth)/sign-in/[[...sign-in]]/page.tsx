import { SignIn } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/theme-toggle'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  )
}