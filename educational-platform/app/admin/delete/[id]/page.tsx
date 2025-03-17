import AuthGuard from "@/components/auth-guard"
import DeletePostConfirmation from "@/components/delete-post-confirmation"

export default function DeletePost({ params }: { params: { id: string } }) {
  return (
    <AuthGuard requireTeacher>
      <DeletePostConfirmation postId={params.id} />
    </AuthGuard>
  )
}

