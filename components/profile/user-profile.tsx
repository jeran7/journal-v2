"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/supabase/auth-context"
import { userProfileService, type UserProfile } from "@/lib/supabase/user-profile-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GlassCard } from "@/components/ui/glass-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check, Upload, User, Settings, Shield, LogOut } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export function UserProfileComponent() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const { toast } = useToast()

  // Form state
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [tradingExperience, setTradingExperience] = useState("")
  const [tradingStyle, setTradingStyle] = useState("")
  const [preferredMarkets, setPreferredMarkets] = useState<string[]>([])
  const [preferredTimeframes, setPreferredTimeframes] = useState<string[]>([])
  const [riskTolerance, setRiskTolerance] = useState(5)
  const [defaultPositionSize, setDefaultPositionSize] = useState(1)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [themePreference, setThemePreference] = useState("system")

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await userProfileService.getCurrentUserProfile()
        if (error) {
          console.error("Error fetching profile:", error)
          return
        }

        if (data) {
          setProfile(data)
          setFullName(data.full_name || "")
          setBio(data.bio || "")
          setTradingExperience(data.trading_experience || "")
          setTradingStyle(data.trading_style || "")
          setPreferredMarkets(data.preferred_markets || [])
          setPreferredTimeframes(data.preferred_timeframes || [])
          setRiskTolerance(data.risk_tolerance || 5)
          setDefaultPositionSize(data.default_position_size || 1)
          setEmailNotifications(data.email_notifications)
          setThemePreference(data.theme_preference || "system")
        }
      } catch (err) {
        console.error("Unexpected error fetching profile:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Upload avatar if changed
      if (avatarFile) {
        const { error } = await userProfileService.uploadAvatar(avatarFile)
        if (error) {
          setError("Failed to upload avatar: " + error.message)
          return
        }
      }

      // Update profile
      const { error } = await userProfileService.updateProfile({
        full_name: fullName,
        bio,
        trading_experience: tradingExperience,
        trading_style: tradingStyle,
        preferred_markets: preferredMarkets,
        preferred_timeframes: preferredTimeframes,
        risk_tolerance: riskTolerance,
        default_position_size: defaultPositionSize,
        email_notifications: emailNotifications,
        theme_preference: themePreference,
      })

      if (error) {
        setError("Failed to update profile: " + error.message)
        return
      }

      setSuccess("Profile updated successfully")
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      })

      // Refresh profile data
      const { data: updatedProfile } = await userProfileService.getCurrentUserProfile()
      if (updatedProfile) {
        setProfile(updatedProfile)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <GlassCard className="w-full max-w-4xl p-6">
        <div className="flex justify-center items-center h-64">
          <p>Loading profile...</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="w-full max-w-4xl">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="p-6">
          <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview || profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                <AvatarFallback>{profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-center">
                <Label
                  htmlFor="avatar-upload"
                  className="cursor-pointer text-sm text-blue-500 hover:text-blue-600 flex items-center"
                >
                  <Upload className="mr-1 h-3 w-3" />
                  Change Avatar
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed directly. Contact support for assistance.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Trader Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself as a trader..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <h3 className="text-lg font-semibold mb-4">Trading Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="mt-6">
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="p-6">
          <h2 className="text-2xl font-bold mb-6">Trading Preferences</h2>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
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
              <Label htmlFor="defaultPositionSize">Default Position Size (%)</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  id="defaultPositionSize"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={[defaultPositionSize]}
                  onValueChange={(value) => setDefaultPositionSize(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center">{defaultPositionSize}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="themePreference">Theme Preference</Label>
              <Select value={themePreference} onValueChange={setThemePreference}>
                <SelectTrigger id="themePreference">
                  <SelectValue placeholder="Select theme preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System Default</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Notification Preferences</Label>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive important updates and alerts via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="p-6">
          <h2 className="text-2xl font-bold mb-6">Account Security</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Password</h3>
              <p className="text-sm text-muted-foreground">Change your password to keep your account secure</p>
              <Button variant="outline" asChild>
                <a href="/auth/update-password">Change Password</a>
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Connected Accounts</h3>
              <p className="text-sm text-muted-foreground">Manage your connected social accounts and login methods</p>
              <div className="mt-2">
                {/* This would be populated with connected accounts */}
                <p className="text-sm">No connected accounts found.</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Account Actions</h3>
              <Button variant="destructive" className="flex items-center" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </GlassCard>
  )
}
