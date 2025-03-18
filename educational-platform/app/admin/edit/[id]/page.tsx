import AuthGuard from "@/components/auth-guard"
import PostForm from "@/components/post-form"

export default function EditPost({ params }: { params: { id: string } }) {
  return (
    <AuthGuard requireTeacher>
      <PostForm postId={params.id} />
    </AuthGuard>
  )
}

