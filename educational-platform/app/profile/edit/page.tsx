import AuthGuard from "@/components/auth-guard"
import EditProfile from "@/components/edit-profile"

export default function EditProfilePage() {
  return (
    <AuthGuard>
      <EditProfile />
    </AuthGuard>
  )
}

