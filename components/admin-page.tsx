"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { postAPI } from "@/lib/api"
import type { Post } from "@/types/post"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit, Trash } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"

export default function AdminPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const { posts: userPosts } = await postAPI.getPostsByUser(user.id)
        setPosts(userPosts)
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message || "Não foi possível carregar seus posts",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [user, toast])

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Painel do Professor</h1>
        <Button asChild>
          <Link href="/admin/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Post
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Seus Posts</CardTitle>
            <CardDescription>Gerencie os posts que você criou</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="divide-y">
                {posts.map((post) => (
                  <div key={post.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Publicado {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/edit/${post.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" asChild>
                        <Link href={`/admin/delete/${post.id}`}>
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Você ainda não criou nenhum post.</p>
                <Button className="mt-4" asChild>
                  <Link href="/admin/create">Criar Seu Primeiro Post</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

