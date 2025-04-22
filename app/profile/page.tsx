import { UserProfileComponent } from "@/components/profile/user-profile"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <UserProfileComponent />
    </div>
  )
}
