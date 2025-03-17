"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { postAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

interface PostFormProps {
  postId?: string
}

export default function PostForm({ postId }: PostFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")

  const isEditing = !!postId

  const fetchPost = useCallback(async () => {
    if (!isEditing || !postId) return

    setIsLoading(true)
    try {
      const { post } = await postAPI.getPostById(postId)

      setTitle(post.title)
      setContent(post.content)
      setImageUrl(post.imageUrl || "")
      setImagePreview(post.imageUrl || "")
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
  }, [isEditing, postId, router, toast])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setImageFile(file)

    // Criar URL temporária para preview
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  const handleImageUpload = async () => {
    if (!imageFile) return null

    setIsUploading(true)
    try {
      const imageUrl = await postAPI.uploadImage(imageFile)
      setImageUrl(imageUrl)
      return imageUrl
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer upload da imagem",
        description: error.message || "Não foi possível fazer o upload da imagem",
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    try {
      // Fazer upload da imagem se houver uma nova
      let finalImageUrl = imageUrl
      if (imageFile) {
        finalImageUrl = (await handleImageUpload()) || ""
      }

      if (isEditing && postId) {
        await postAPI.updatePost(postId, {
          title,
          content,
          imageUrl: finalImageUrl,
        })

        toast({
          title: "Post atualizado",
          description: "Seu post foi atualizado com sucesso",
        })
      } else {
        await postAPI.createPost({
          title,
          content,
          imageUrl: finalImageUrl,
        })

        toast({
          title: "Post criado",
          description: "Seu post foi criado com sucesso",
        })
      }

      router.push("/admin")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description:
          error.message || (isEditing ? "Não foi possível atualizar o post" : "Não foi possível criar o post"),
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
          <CardTitle>{isEditing ? "Editar Post" : "Criar Post"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Atualize seu post existente"
              : "Compartilhe conhecimento com seus alunos criando um novo post"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do post"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva o conteúdo do seu post aqui..."
                className="min-h-[200px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagem (opcional)</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={() => document.getElementById("image")?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar imagem
                  </Button>
                  {imageFile && <span className="text-sm text-muted-foreground">{imageFile.name}</span>}
                </div>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
              {imagePreview && (
                <div className="mt-2 relative w-full h-48 overflow-hidden rounded-md border">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${imagePreview})` }}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/admin")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving || isUploading || !title.trim() || !content.trim()}>
              {isSaving || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? "Enviando imagem..." : isEditing ? "Atualizando..." : "Criando..."}
                </>
              ) : isEditing ? (
                "Atualizar Post"
              ) : (
                "Criar Post"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

