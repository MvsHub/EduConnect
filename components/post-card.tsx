"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useAuth } from "@/context/auth-context"
import type { Post } from "@/types/post"
import { postAPI, commentAPI } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, MoreHorizontal, Trash, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface PostCardProps {
  post: Post
  onPostUpdate: (post: Post) => void
  showActions?: boolean
}

export default function PostCard({ post, onPostUpdate, showActions = true }: PostCardProps) {
  const { user, isTeacher } = useAuth()
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLike = async () => {
    if (!user) return

    try {
      setIsLiking(true)
      const { post: updatedPost } = await postAPI.likePost(post.id)
      onPostUpdate(updatedPost)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível curtir o post",
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !comment.trim()) return

    setIsSubmitting(true)

    try {
      const newComment = await commentAPI.createComment(post.id, comment)

      // Atualizar o post com o novo comentário
      const updatedPost = {
        ...post,
        comments: [newComment, ...post.comments],
      }

      onPostUpdate(updatedPost)
      setComment("")
      setShowComments(true)

      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível adicionar o comentário",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentAPI.deleteComment(commentId)

      // Atualizar o post removendo o comentário
      const updatedPost = {
        ...post,
        comments: post.comments.filter((c) => c.id !== commentId),
      }

      onPostUpdate(updatedPost)

      toast({
        title: "Comentário excluído",
        description: "Seu comentário foi excluído com sucesso",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível excluir o comentário",
      })
    }
  }

  const handleEdit = () => {
    router.push(`/admin/edit/${post.id}`)
  }

  const isAuthor = user?.id === post.author.id
  const hasLiked = user ? post.likes.includes(user.id) : false

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.author.profilePicture || "/placeholder.svg?height=40&width=40"} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${post.author.id}`} className="font-semibold hover:underline">
              {post.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
            </p>
          </div>
        </div>

        {showActions && isTeacher() && isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Mais opções</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => router.push(`/admin/delete/${post.id}`)}
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="mt-2">{post.content}</p>
        </div>

        {post.imageUrl && (
          <div className="relative w-full h-64 overflow-hidden rounded-md">
            <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={handleLike}
              disabled={isLiking || !user}
            >
              <Heart className={`h-4 w-4 ${hasLiked ? "fill-red-500 text-red-500" : ""}`} />
              <span>{post.likes.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length}</span>
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="w-full space-y-4">
            {post.comments.length > 0 && (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={comment.author.profilePicture || "/placeholder.svg?height=24&width=24"} />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex justify-between items-start">
                          <Link href={`/profile/${comment.author.id}`} className="font-semibold hover:underline">
                            {comment.author.name}
                          </Link>
                          {user && comment.author.id === user.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 -mt-1 -mr-1"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash className="h-3 w-3" />
                              <span className="sr-only">Excluir comentário</span>
                            </Button>
                          )}
                        </div>
                        <p>{comment.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {user && (
              <form onSubmit={handleComment} className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profilePicture || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="min-h-[80px]"
                  />
                  <Button type="submit" size="sm" disabled={!comment.trim() || isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Comentar"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

