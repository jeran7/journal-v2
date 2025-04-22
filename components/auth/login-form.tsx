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

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showMagicLinkSent, setShowMagicLinkSent] = useState(false)
  const { signIn, signInWithProvider, signInWithMagicLink } = useAuth()
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
        return
      }
      router.push("/dashboard")
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

  const handleMagicLinkLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signInWithMagicLink(email)
      if (error) {
        setError(error.message)
        return
      }
      setShowMagicLinkSent(true)
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (showMagicLinkSent) {
    return (
      <GlassCard className="w-full max-w-md p-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Mail className="h-12 w-12 text-blue-500" />
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent a magic link to <strong>{email}</strong>. Check your email and click the link to log in.
          </p>
          <Button variant="outline" className="mt-4 w-full" onClick={() => setShowMagicLinkSent(false)}>
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

      <h1 className="text-2xl font-bold text-center mb-6">Log in to your account</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/auth/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor="remember" className="text-sm font-normal">
            Remember me for 30 days
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in with Email"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleMagicLinkLogin}
          disabled={isLoading || !email}
        >
          <Mail className="mr-2 h-4 w-4" />
          {isLoading ? "Sending..." : "Send Magic Link"}
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
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-blue-500 hover:text-blue-600 font-medium">
          Sign up
        </Link>
      </p>
    </GlassCard>
  )
}
