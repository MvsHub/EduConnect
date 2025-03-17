const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

// Modelos
const User = require("../dist/models/User").default
const Post = require("../dist/models/Post").default
const Comment = require("../dist/models/Comment").default

// Dados de exemplo
const seedData = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Conectado ao MongoDB")

    // Limpar dados existentes
    await User.deleteMany({})
    await Post.deleteMany({})
    await Comment.deleteMany({})
    console.log("Dados existentes removidos")

    // Criar usuários
    const passwordHash = await bcrypt.hash("password123", 10)

    const teacher = await User.create({
      name: "John Doe",
      email: "teacher@example.com",
      password: passwordHash,
      role: "teacher",
      education: "PhD em Ciência da Computação",
      bio: "Apaixonado por ensinar programação e tecnologia.",
      profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    })

    const student = await User.create({
      name: "Jane Smith",
      email: "student@example.com",
      password: passwordHash,
      role: "student",
      bio: "Ansiosa para aprender e crescer no campo da tecnologia.",
      profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
    })

    console.log("Usuários criados")

    // Criar posts
    const post1 = await Post.create({
      title: "Introdução ao React",
      content:
        "React é uma biblioteca JavaScript para construir interfaces de usuário. Permite que os desenvolvedores criem componentes de UI reutilizáveis e gerenciem o estado de forma eficiente.",
      imageUrl: "https://miro.medium.com/max/1400/1*yjH3SiDaVWtpBX0g_2q68g.png",
      author: teacher._id,
      likes: [student._id],
    })

    const post2 = await Post.create({
      title: "Técnicas Avançadas de CSS",
      content:
        "Aprenda sobre CSS Grid, Flexbox e outros recursos modernos do CSS que podem ajudá-lo a criar layouts responsivos e bonitos.",
      author: teacher._id,
    })

    console.log("Posts criados")

    // Criar comentários
    await Comment.create({
      content: "Ótima introdução! Ansioso para aprender mais.",
      author: student._id,
      post: post1._id,
    })

    console.log("Comentários criados")

    console.log("Seed concluído com sucesso!")
    process.exit(0)
  } catch (error) {
    console.error("Erro durante o seed:", error)
    process.exit(1)
  }
}

seedData()

