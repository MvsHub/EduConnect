import AuthGuard from "@/components/auth-guard"
import PostForm from "@/components/post-form"

export default function CreatePost() {
  return (
    <AuthGuard requireTeacher>
      <PostForm />
    </AuthGuard>
  )
}

