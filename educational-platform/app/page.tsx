import AuthGuard from "@/components/auth-guard"
import FeedPage from "@/components/feed-page"

export default function Home() {
  return (
    <AuthGuard>
      <FeedPage />
    </AuthGuard>
  )
}

