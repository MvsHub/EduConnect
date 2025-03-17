import AuthGuard from "@/components/auth-guard"
import UserProfile from "@/components/user-profile"

export default function ProfilePage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <UserProfile userId={params.id} />
    </AuthGuard>
  )
}

