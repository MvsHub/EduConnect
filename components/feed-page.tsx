"use client"

import { useState, useEffect } from "react"
import { postAPI } from "@/lib/api"
import type { Post } from "@/types/post"
import PostCard from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const fetchPosts = async (page = 1) => {
    setIsLoading(true)
    try {
      const { posts: fetchedPosts, totalPages, currentPage } = await postAPI.getAllPosts(page)

      if (page === 1) {
        setPosts(fetchedPosts)
      } else {
        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts])
      }

      setTotalPages(totalPages)
      setCurrentPage(currentPage)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar posts",
        description: error.message || "Não foi possível carregar os posts",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchPosts(currentPage + 1)
    }
  }

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)))
  }

  return (
    <div className="container py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Feed</h1>

      {isLoading && posts.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} />
            ))}
          </div>

          {currentPage < totalPages && (
            <div className="mt-8 flex justify-center">
              <Button onClick={handleLoadMore} disabled={isLoading} variant="outline" className="w-full max-w-xs">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  "Carregar mais posts"
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum post disponível. Volte mais tarde!</p>
        </div>
      )}
    </div>
  )
}

