"use client"

import { useState } from "react"
import { useAuth } from "@/lib/supabase/auth-context"
import { userProfileService } from "@/lib/supabase/user-profile-service"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export function OnboardingForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [fullName, setFullName] = useState("")
  const [tradingExperience, setTradingExperience] = useState("")
  const [tradingStyle, setTradingStyle] = useState("")
  const [preferredMarkets, setPreferredMarkets] = useState<string[]>([])
  const [preferredTimeframes, setPreferredTimeframes] = useState<string[]>([])
  const [riskTolerance, setRiskTolerance] = useState(5)
  const [bio, setBio] = useState("")

  const handleMarketToggle = (market: string) => {
    if (preferredMarkets.includes(market)) {
      setPreferredMarkets(preferredMarkets.filter((m) => m !== market))
    } else {
      setPreferredMarkets([...preferredMarkets, market])
    }
  }

  const handleTimeframeToggle = (timeframe: string) => {
    if (preferredTimeframes.includes(timeframe)) {
      setPreferredTimeframes(preferredTimeframes.filter((t) => t !== timeframe))
    } else {
      setPreferredTimeframes([...preferredTimeframes, timeframe])
    }
  }

  const handleNextStep = () => {
    if (step === 1 && !fullName) {
      setError("Please enter your name to continue")
      return
    }

    if (step === 2 && !tradingExperience) {
      setError("Please select your trading experience to continue")
      return
    }

    if (step === 3 && preferredMarkets.length === 0) {
      setError("Please select at least one market to continue")
      return
    }

    setError(null)
    setStep(step + 1)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  const handleComplete = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await userProfileService.updateProfile({
        full_name: fullName,
        trading_experience: tradingExperience,
        trading_style: tradingStyle,
        preferred_markets: preferredMarkets,
        preferred_timeframes: preferredTimeframes,
        risk_tolerance: riskTolerance,
        bio,
        completed_onboarding: true,
      })

      if (error) {
        setError("Failed to save profile: " + error.message)
        return
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassCard className="w-full max-w-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Set Up Your Trading Profile</h1>
        <div className="text-sm text-muted-foreground">Step {step} of 4</div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Welcome to Trading Journal!</h2>
          <p className="text-muted-foreground">
            Let's set up your profile to personalize your trading journal experience.
          </p>

          <div className="space-y-2 mt-4">
            <Label htmlFor="fullName">What's your name?</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Trading Background</h2>
          <p className="text-muted-foreground">Tell us about your trading experience and style.</p>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="tradingExperience">Trading Experience</Label>
              <Select value={tradingExperience} onValueChange={setTradingExperience}>
                <SelectTrigger id="tradingExperience">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner ({"<"} 1 year)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                  <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                  <SelectItem value="expert">Expert (5+ years)</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tradingStyle">Primary Trading Style</Label>
              <Select value={tradingStyle} onValueChange={setTradingStyle}>
                <SelectTrigger id="tradingStyle">
                  <SelectValue placeholder="Select your trading style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day Trading</SelectItem>
                  <SelectItem value="swing">Swing Trading</SelectItem>
                  <SelectItem value="position">Position Trading</SelectItem>
                  <SelectItem value="scalping">Scalping</SelectItem>
                  <SelectItem value="investing">Long-term Investing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Markets & Timeframes</h2>
          <p className="text-muted-foreground">Select the markets you trade and your preferred timeframes.</p>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Markets You Trade</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Stocks", "Futures", "Forex", "Crypto", "Options", "Commodities"].map((market) => (
                  <div key={market} className="flex items-center space-x-2">
                    <Checkbox
                      id={`market-${market}`}
                      checked={preferredMarkets.includes(market.toLowerCase())}
                      onCheckedChange={() => handleMarketToggle(market.toLowerCase())}
                    />
                    <Label htmlFor={`market-${market}`} className="text-sm font-normal">
                      {market}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Timeframes</Label>
              <div className="grid grid-cols-2 gap-2">
                {["1m", "5m", "15m", "30m", "1h", "4h", "Daily", "Weekly"].map((timeframe) => (
                  <div key={timeframe} className="flex items-center space-x-2">
                    <Checkbox
                      id={`timeframe-${timeframe}`}
                      checked={preferredTimeframes.includes(timeframe.toLowerCase())}
                      onCheckedChange={() => handleTimeframeToggle(timeframe.toLowerCase())}
                    />
                    <Label htmlFor={`timeframe-${timeframe}`} className="text-sm font-normal">
                      {timeframe}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Final Details</h2>
          <p className="text-muted-foreground">Just a few more details to complete your profile.</p>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="riskTolerance">Risk Tolerance (1-10)</Label>
              <div className="flex items-center space-x-4">
                <span className="text-sm">Conservative</span>
                <Slider
                  id="riskTolerance"
                  min={1}
                  max={10}
                  step={1}
                  value={[riskTolerance]}
                  onValueChange={(value) => setRiskTolerance(value[0])}
                  className="flex-1"
                />
                <span className="text-sm">Aggressive</span>
                <span className="w-8 text-center">{riskTolerance}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Trader Bio (Optional)</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your trading journey, goals, or anything else..."
                rows={4}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button variant="outline" onClick={handlePreviousStep} disabled={isLoading}>
            Back
          </Button>
        ) : (
          <div></div>
        )}

        {step < 4 ? (
          <Button onClick={handleNextStep} disabled={isLoading}>
            Continue
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={isLoading}>
            {isLoading ? "Completing..." : "Complete Setup"}
          </Button>
        )}
      </div>
    </GlassCard>
  )
}
