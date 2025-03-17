"use client"

import type { Post, Comment } from "@/types/post"

// Mock data for posts
let MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "Introduction to React",
    content:
      "React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and manage state efficiently.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    author: {
      id: "1",
      name: "John Doe",
      email: "teacher@example.com",
      role: "teacher",
      education: "PhD in Computer Science",
      profilePicture: "/placeholder.svg?height=200&width=200",
    },
    createdAt: "2023-10-15T10:30:00Z",
    likes: ["2"],
    comments: [
      {
        id: "101",
        content: "Great introduction! Looking forward to learning more.",
        author: {
          id: "2",
          name: "Jane Smith",
          email: "student@example.com",
          role: "student",
          profilePicture: "/placeholder.svg?height=200&width=200",
        },
        createdAt: "2023-10-15T11:45:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Advanced CSS Techniques",
    content:
      "Learn about CSS Grid, Flexbox, and other modern CSS features that can help you create responsive and beautiful layouts.",
    author: {
      id: "1",
      name: "John Doe",
      email: "teacher@example.com",
      role: "teacher",
      education: "PhD in Computer Science",
      profilePicture: "/placeholder.svg?height=200&width=200",
    },
    createdAt: "2023-10-14T09:15:00Z",
    likes: [],
    comments: [],
  },
]

// Get all posts
export function getPosts(): Post[] {
  return [...MOCK_POSTS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Get a single post by ID
export function getPostById(id: string): Post | undefined {
  return MOCK_POSTS.find((post) => post.id === id)
}

// Create a new post
export function createPost(post: Omit<Post, "id" | "createdAt" | "likes" | "comments">): Post {
  const newPost: Post = {
    ...post,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    likes: [],
    comments: [],
  }

  MOCK_POSTS = [newPost, ...MOCK_POSTS]
  return newPost
}

// Update an existing post
export function updatePost(id: string, updates: Partial<Post>): Post | undefined {
  const index = MOCK_POSTS.findIndex((post) => post.id === id)

  if (index !== -1) {
    MOCK_POSTS[index] = { ...MOCK_POSTS[index], ...updates }
    return MOCK_POSTS[index]
  }

  return undefined
}

// Delete a post
export function deletePost(id: string): boolean {
  const initialLength = MOCK_POSTS.length
  MOCK_POSTS = MOCK_POSTS.filter((post) => post.id !== id)
  return MOCK_POSTS.length !== initialLength
}

// Add a comment to a post
export function addComment(postId: string, comment: Omit<Comment, "id" | "createdAt">): Post | undefined {
  const post = getPostById(postId)

  if (post) {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    post.comments.push(newComment)
    return post
  }

  return undefined
}

// Toggle like on a post
export function toggleLike(postId: string, userId: string): Post | undefined {
  const post = getPostById(postId)

  if (post) {
    const hasLiked = post.likes.includes(userId)

    if (hasLiked) {
      post.likes = post.likes.filter((id) => id !== userId)
    } else {
      post.likes.push(userId)
    }

    return post
  }

  return undefined
}

// Get posts by user ID
export function getPostsByUser(userId: string): Post[] {
  return MOCK_POSTS.filter((post) => post.author.id === userId)
}

