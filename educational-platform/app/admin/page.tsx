import AuthGuard from "@/components/auth-guard"
import AdminPage from "@/components/admin-page"

export default function Admin() {
  return (
    <AuthGuard requireTeacher>
      <AdminPage />
    </AuthGuard>
  )
}

