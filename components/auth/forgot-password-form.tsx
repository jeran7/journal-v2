"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/supabase/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { AlertCircle, Mail, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const { resetPassword } = useAuth()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await resetPassword(email)
      if (error) {
        setError(error.message)
        return
      }
      setResetSent(true)
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (resetSent) {
    return (
      <GlassCard className="w-full max-w-md p-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Mail className="h-12 w-12 text-blue-500" />
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent password reset instructions to <strong>{email}</strong>. Check your email and follow the link to
            reset your password.
          </p>
          <Button variant="outline" className="mt-4 w-full" onClick={() => setResetSent(false)}>
            Back to reset form
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

      <h1 className="text-2xl font-bold text-center mb-2">Reset your password</h1>
      <p className="text-center text-muted-foreground mb-6">
        Enter your email and we'll send you a link to reset your password
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleResetPassword} className="space-y-4">
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
    </GlassCard>
  )
}
