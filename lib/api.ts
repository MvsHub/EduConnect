// Serviço para comunicação com a API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Função auxiliar para fazer requisições à API
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`

  // Adicionar token de autenticação se disponível
  const token = localStorage.getItem("accessToken")
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()

    if (!response.ok) {
      // Se o token expirou, tentar atualizar
      if (response.status === 401) {
        const refreshed = await refreshToken()
        if (refreshed) {
          // Tentar novamente com o novo token
          return fetchAPI(endpoint, options)
        }
      }
      throw new Error(data.error || "Erro na requisição")
    }

    return data
  } catch (error) {
    console.error("Erro na API:", error)
    throw error
  }
}

// Tentar atualizar o token
async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken")
  if (!refreshToken) return false

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      // Se não conseguir atualizar, fazer logout
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      return false
    }

    const data = await response.json()
    localStorage.setItem("accessToken", data.data.tokens.accessToken)
    localStorage.setItem("refreshToken", data.data.tokens.refreshToken)
    return true
  } catch (error) {
    console.error("Erro ao atualizar token:", error)
    return false
  }
}

// API de autenticação
export const authAPI = {
  register: async (userData: any) => {
    return fetchAPI("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
  },

  login: async (email: string, password: string) => {
    const data = await fetchAPI("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    // Salvar tokens
    localStorage.setItem("accessToken", data.data.tokens.accessToken)
    localStorage.setItem("refreshToken", data.data.tokens.refreshToken)

    return data.data.user
  },

  logout: async () => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (refreshToken) {
      await fetchAPI("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })
    }

    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  },
}

// API de usuários
export const userAPI = {
  getProfile: async (userId: string) => {
    const data = await fetchAPI(`/users/${userId}`)
    return data.data.user
  },

  updateProfile: async (profileData: any) => {
    const data = await fetchAPI("/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })
    return data.data.user
  },

  uploadProfilePicture: async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)

    const data = await fetchAPI("/upload", {
      method: "POST",
      body: formData,
    })

    return data.data.url
  },
}

// API de posts
export const postAPI = {
  getAllPosts: async (page = 1, limit = 10) => {
    const data = await fetchAPI(`/posts?page=${page}&limit=${limit}`)
    return {
      posts: data.data.posts,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
    }
  },

  getPostById: async (postId: string) => {
    const data = await fetchAPI(`/posts/${postId}`)
    return {
      post: data.data.post,
      comments: data.data.comments,
    }
  },

  getPostsByUser: async (userId: string, page = 1, limit = 10) => {
    const data = await fetchAPI(`/posts/user/${userId}?page=${page}&limit=${limit}`)
    return {
      posts: data.data.posts,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
    }
  },

  createPost: async (postData: any) => {
    const data = await fetchAPI("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
    return data.data.post
  },

  updatePost: async (postId: string, postData: any) => {
    const data = await fetchAPI(`/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
    return data.data.post
  },

  deletePost: async (postId: string) => {
    await fetchAPI(`/posts/${postId}`, {
      method: "DELETE",
    })
    return true
  },

  likePost: async (postId: string) => {
    const data = await fetchAPI(`/posts/${postId}/like`, {
      method: "POST",
    })
    return {
      post: data.data.post,
      liked: data.data.liked,
    }
  },

  uploadImage: async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)

    const data = await fetchAPI("/upload", {
      method: "POST",
      body: formData,
    })

    return data.data.url
  },
}

// API de comentários
export const commentAPI = {
  getCommentsByPost: async (postId: string, page = 1, limit = 20) => {
    const data = await fetchAPI(`/comments/post/${postId}?page=${page}&limit=${limit}`)
    return {
      comments: data.data.comments,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
    }
  },

  createComment: async (postId: string, content: string) => {
    const data = await fetchAPI(`/comments/post/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })
    return data.data.comment
  },

  deleteComment: async (commentId: string) => {
    await fetchAPI(`/comments/${commentId}`, {
      method: "DELETE",
    })
    return true
  },
}

