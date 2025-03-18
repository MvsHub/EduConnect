import type { User } from "@/context/auth-context"

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  imageUrl?: string
  author: User
  createdAt: string
  likes: string[] // Array of user IDs who liked the post
  comments: Comment[]
}

