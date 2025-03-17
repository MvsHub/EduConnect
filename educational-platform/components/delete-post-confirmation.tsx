"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { postAPI } from "@/lib/api"
import type { Post } from "@/types/post"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface DeletePostConfirmationProps {
  postId: string
}

export default function DeletePostConfirmation({ postId }: DeletePostConfirmationProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      try {
        const { post } = await postAPI.getPostById(postId)
        setPost(post)
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message || "Não foi possível carregar o post",
        })
        router.push("/admin")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [postId, router, toast])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await postAPI.deletePost(postId)

      toast({
        title: "Post excluído",
        description: "Seu post foi excluído com sucesso",
      })

      router.push("/admin")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível excluir o post",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Admin
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Excluir Post
          </CardTitle>
          <CardDescription>Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{post.content}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin">Cancelar</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir Post"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

