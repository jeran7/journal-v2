"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/supabase/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { GlassCard } from "@/components/ui/glass-card"
import { AlertCircle, Github, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function RegisterForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showVerificationSent, setShowVerificationSent] = useState(false)
  const { signUp, signInWithProvider } = useAuth()
  const router = useRouter()

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, and numbers")
      setIsLoading(false)
      return
    }

    if (!agreedToTerms) {
      setError("You must agree to the terms of service and privacy policy")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password, { full_name: fullName })
      if (error) {
        setError(error.message)
        return
      }
      setShowVerificationSent(true)
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderLogin = async (provider: "github" | "google") => {
    try {
      await signInWithProvider(provider)
    } catch (err) {
      setError("An error occurred with social login. Please try again.")
      console.error(err)
    }
  }

  if (showVerificationSent) {
    return (
      <GlassCard className="w-full max-w-md p-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Mail className="h-12 w-12 text-blue-500" />
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground">
            We've sent a verification link to <strong>{email}</strong>. Please check your email and click the link to
            complete your registration.
          </p>
          <Button variant="outline" className="mt-4 w-full" onClick={() => router.push("/auth/login")}>
            Back to login
          </Button>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="w-full max-w-md p-6">
      <div className="flex justify-center mb-6">
        <Image src="/financial-growth-journal.png" alt="Trading Journal" width={180} height={40} priority />
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">Create your account</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Password must be at least 8 characters and include uppercase, lowercase, and numbers
          </p>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm font-normal leading-tight">
            I agree to the{" "}
            <Link href="/terms" className="text-blue-500 hover:text-blue-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-500 hover:text-blue-600">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-muted-foreground text-sm">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button variant="outline" onClick={() => handleProviderLogin("github")} disabled={isLoading}>
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-500 hover:text-blue-600 font-medium">
          Log in
        </Link>
      </p>
    </GlassCard>
  )
}
