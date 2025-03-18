"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { userAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function EditProfile() {
  const { user, isLoading: authLoading, updateUserProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [education, setEducation] = useState("")
  const [profilePicture, setProfilePicture] = useState("")
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setBio(user.bio || "")
      setEducation(user.education || "")
      setProfilePicture(user.profilePicture || "")
      setProfilePicturePreview(user.profilePicture || "")
    }
  }, [user])

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setProfilePictureFile(file)

    // Criar URL temporária para preview
    const previewUrl = URL.createObjectURL(file)
    setProfilePicturePreview(previewUrl)
  }

  const handleProfilePictureUpload = async () => {
    if (!profilePictureFile) return null

    setIsUploading(true)
    try {
      const imageUrl = await userAPI.uploadProfilePicture(profilePictureFile)
      setProfilePicture(imageUrl)
      return imageUrl
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer upload da imagem",
        description: error.message || "Não foi possível fazer o upload da imagem de perfil",
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      // Fazer upload da imagem de perfil se houver uma nova
      let finalProfilePicture = profilePicture
      if (profilePictureFile) {
        finalProfilePicture = (await handleProfilePictureUpload()) || ""
      }

      await updateUserProfile({
        name,
        bio,
        education: user.role === "teacher" ? education : undefined,
        profilePicture: finalProfilePicture,
      })

      router.push(`/profile/${user.id}`)
    } catch (error) {
      // Erro já tratado no updateUserProfile
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/profile/${user.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Perfil
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
          <CardDescription>Atualize suas informações pessoais</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Função</Label>
              <Input value={user.role === "teacher" ? "Professor" : "Aluno"} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Sua função não pode ser alterada</p>
            </div>

            {user.role === "teacher" && (
              <div className="space-y-2">
                <Label htmlFor="education">Formação</Label>
                <Input
                  id="education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="Digite sua formação acadêmica"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Sobre Mim)</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Escreva uma breve descrição sobre você"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePicture">Foto de Perfil</Label>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar imagem
                  </Button>
                  {profilePictureFile && (
                    <span className="text-sm text-muted-foreground">{profilePictureFile.name}</span>
                  )}
                </div>
                <Input
                  ref={fileInputRef}
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                {profilePicturePreview && (
                  <div className="mt-2 relative w-32 h-32 mx-auto overflow-hidden rounded-full border">
                    <Image
                      src={profilePicturePreview || "/placeholder.svg"}
                      alt="Preview da foto de perfil"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push(`/profile/${user.id}`)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isUploading || !name.trim()}>
              {isLoading || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? "Enviando imagem..." : "Salvando..."}
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

