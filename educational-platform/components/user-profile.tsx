"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { userAPI, postAPI } from "@/lib/api"
import type { Post } from "@/types/post"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, PenSquare } from "lucide-react"
import PostCard from "@/components/post-card"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface UserProfileProps {
  userId: string
}

export default function UserProfile({ userId }: UserProfileProps) {
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState<any>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setIsLoading(true)
      try {
        // Buscar dados do usuário
        const userData = await userAPI.getProfile(userId)
        setProfileUser(userData)

        // Buscar posts do usuário
        const { posts: userPosts } = await postAPI.getPostsByUser(userId)
        setPosts(userPosts)
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message || "Não foi possível carregar o perfil",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndPosts()
  }, [userId, toast])

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)))
  }

  const isOwnProfile = currentUser?.id === userId

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="container py-6 max-w-4xl">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Usuário não encontrado</h2>
              <p className="text-muted-foreground mt-2">
                O usuário que você está procurando não existe ou foi removido.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/">Voltar para o feed</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6 max-w-4xl">
      <Card>
        <CardHeader className="relative pb-0">
          {isOwnProfile && (
            <div className="absolute top-4 right-4">
              <Button size="sm" variant="outline" asChild>
                <Link href="/profile/edit">
                  <PenSquare className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Link>
              </Button>
            </div>
          )}
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6 pt-6">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-background">
              <Image
                src={profileUser.profilePicture || "/placeholder.svg?height=128&width=128"}
                alt={profileUser.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <CardTitle className="text-2xl">{profileUser.name}</CardTitle>
              <CardDescription className="capitalize">
                {profileUser.role === "teacher" ? "Professor" : "Aluno"}
                {profileUser.role === "teacher" && profileUser.education && <span> • {profileUser.education}</span>}
              </CardDescription>
              {profileUser.bio && <p className="mt-2 text-sm">{profileUser.bio}</p>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="posts">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="about">Sobre</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6">
              {posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} showActions={false} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum post disponível.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="about" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Função</h3>
                  <p className="capitalize">{profileUser.role === "teacher" ? "Professor" : "Aluno"}</p>
                </div>

                {profileUser.role === "teacher" && profileUser.education && (
                  <div>
                    <h3 className="font-medium">Formação</h3>
                    <p>{profileUser.education}</p>
                  </div>
                )}

                {profileUser.bio && (
                  <div>
                    <h3 className="font-medium">Bio</h3>
                    <p>{profileUser.bio}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

