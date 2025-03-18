Thought for 1 secondAqui está o conteúdo completo do README.md que você pode copiar e salvar diretamente em um arquivo:

```markdown
# EduConnect

![EduConnect Logo](/placeholder.svg?height=200&width=400)

## 📚 Sobre o Projeto

EduConnect é uma plataforma educacional que conecta professores e alunos através de um ambiente interativo de compartilhamento de conteúdo. A plataforma permite que professores publiquem materiais educacionais, enquanto os alunos podem interagir através de comentários e curtidas.

## ✨ Funcionalidades

### Gerais
- 🔐 Sistema de autenticação e autorização
- 👤 Perfis de usuário (professor e aluno)
- 🌓 Suporte a tema claro/escuro

### Para Professores
- 📝 Criação, edição e exclusão de posts educacionais
- 📊 Painel administrativo para gerenciar conteúdo
- 📷 Upload de imagens para posts

### Para Alunos
- 📚 Feed de conteúdo educacional
- 💬 Comentários em posts
- ❤️ Curtidas em posts
- 👀 Visualização de perfis de outros usuários

### Perfil de Usuário
- ✏️ Edição de informações pessoais
- 🖼️ Upload de foto de perfil
- 📋 Visualização de histórico de posts

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** (App Router) - Framework React para renderização híbrida
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de UI reutilizáveis
- **date-fns** - Biblioteca para manipulação de datas
- **Lucide React** - Ícones modernos para React

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para Node.js
- **TypeScript** - Superset tipado de JavaScript
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação baseada em tokens
- **Bcrypt** - Hashing de senhas
- **Multer** - Middleware para upload de arquivos
- **Vercel Blob Storage** - Armazenamento de imagens
- **Winston** - Sistema de logging
- **Joi** - Validação de dados

## 📁 Estrutura do Projeto
```

Thought for 1 secondAqui está o conteúdo completo do README.md que você pode copiar e salvar diretamente em um arquivo:

```markdown
# EduConnect

![EduConnect Logo](/placeholder.svg?height=200&width=400)

## 📚 Sobre o Projeto

EduConnect é uma plataforma educacional que conecta professores e alunos através de um ambiente interativo de compartilhamento de conteúdo. A plataforma permite que professores publiquem materiais educacionais, enquanto os alunos podem interagir através de comentários e curtidas.

## ✨ Funcionalidades

### Gerais
- 🔐 Sistema de autenticação e autorização
- 👤 Perfis de usuário (professor e aluno)
- 🌓 Suporte a tema claro/escuro

### Para Professores
- 📝 Criação, edição e exclusão de posts educacionais
- 📊 Painel administrativo para gerenciar conteúdo
- 📷 Upload de imagens para posts

### Para Alunos
- 📚 Feed de conteúdo educacional
- 💬 Comentários em posts
- ❤️ Curtidas em posts
- 👀 Visualização de perfis de outros usuários

### Perfil de Usuário
- ✏️ Edição de informações pessoais
- 🖼️ Upload de foto de perfil
- 📋 Visualização de histórico de posts

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** (App Router) - Framework React para renderização híbrida
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de UI reutilizáveis
- **date-fns** - Biblioteca para manipulação de datas
- **Lucide React** - Ícones modernos para React

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para Node.js
- **TypeScript** - Superset tipado de JavaScript
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação baseada em tokens
- **Bcrypt** - Hashing de senhas
- **Multer** - Middleware para upload de arquivos
- **Vercel Blob Storage** - Armazenamento de imagens
- **Winston** - Sistema de logging
- **Joi** - Validação de dados

## 📁 Estrutura do Projeto

```

EduConnect/
├── app/                    # Páginas e rotas do Next.js
│   ├── admin/              # Área administrativa (professores)
│   ├── auth/               # Páginas de autenticação
│   ├── profile/            # Páginas de perfil
│   └── globals.css         # Estilos globais
├── components/             # Componentes React reutilizáveis
├── context/                # Contextos React (auth, tema)
├── lib/                    # Utilitários e funções auxiliares
├── public/                 # Arquivos estáticos
├── src/                    # Código do backend
│   ├── controllers/        # Controladores da API
│   ├── middlewares/        # Middlewares Express
│   ├── models/             # Modelos Mongoose
│   ├── routes/             # Rotas da API
│   ├── services/           # Serviços
│   ├── utils/              # Utilitários
│   └── server.ts           # Ponto de entrada do servidor
├── scripts/                # Scripts utilitários
├── types/                  # Definições de tipos TypeScript
├── .env.example            # Exemplo de variáveis de ambiente
├── next.config.mjs         # Configuração do Next.js
├── package.json            # Dependências e scripts
├── tsconfig.json           # Configuração do TypeScript
└── vercel.json             # Configuração de deploy na Vercel


## 🔧 Requisitos de Sistema

- Node.js 18.x ou superior
- MongoDB 4.4 ou superior
- NPM 8.x ou superior
- Conta na Vercel (para Blob Storage)

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/MvsHub/EduConnect.git
cd EduConnect

2. Instale as dependências

# Instalar dependências do projeto (frontend e backend)
npm install

# Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

cp .env.example .env

# Edite o arquivo `.env` com suas configurações:

NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/educational-platform?retryWrites=true&w=majority
JWT_SECRET=seu_jwt_secret_key
BLOB_READ_WRITE_TOKEN=seu_vercel_blob_token
NEXT_PUBLIC_API_URL=http://localhost:3001/api

Inicialize o banco de dados com dados de exemplo (opcional)

# Compilar o TypeScript do backend
npm run build

# Executar o script de seed
npm run seed

##  Executando o Projeto

### Desenvolvimento

Para executar o projeto em modo de desenvolvimento:

# Terminal 1: Executar o backend
npm run dev

# Terminal 2: Executar o frontend (em outro terminal)
npm run dev:frontend

Acesse:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001/api](http://localhost:3001/api)


### Produção

Para build de produção:

# Build do frontend e backend
npm run build

# Iniciar em modo produção
npm start

Thought for 1 secondAqui está o conteúdo completo do README.md que você pode copiar e salvar diretamente em um arquivo:

```markdown
# EduConnect

![EduConnect Logo](/placeholder.svg?height=200&width=400)

## 📚 Sobre o Projeto

EduConnect é uma plataforma educacional que conecta professores e alunos através de um ambiente interativo de compartilhamento de conteúdo. A plataforma permite que professores publiquem materiais educacionais, enquanto os alunos podem interagir através de comentários e curtidas.

## ✨ Funcionalidades

### Gerais
- 🔐 Sistema de autenticação e autorização
- 👤 Perfis de usuário (professor e aluno)
- 🌓 Suporte a tema claro/escuro

### Para Professores
- 📝 Criação, edição e exclusão de posts educacionais
- 📊 Painel administrativo para gerenciar conteúdo
- 📷 Upload de imagens para posts

### Para Alunos
- 📚 Feed de conteúdo educacional
- 💬 Comentários em posts
- ❤️ Curtidas em posts
- 👀 Visualização de perfis de outros usuários

### Perfil de Usuário
- ✏️ Edição de informações pessoais
- 🖼️ Upload de foto de perfil
- 📋 Visualização de histórico de posts

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** (App Router) - Framework React para renderização híbrida
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de UI reutilizáveis
- **date-fns** - Biblioteca para manipulação de datas
- **Lucide React** - Ícones modernos para React

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para Node.js
- **TypeScript** - Superset tipado de JavaScript
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação baseada em tokens
- **Bcrypt** - Hashing de senhas
- **Multer** - Middleware para upload de arquivos
- **Vercel Blob Storage** - Armazenamento de imagens
- **Winston** - Sistema de logging
- **Joi** - Validação de dados

## 📁 Estrutura do Projeto

```

EduConnect/
├── app/                    # Páginas e rotas do Next.js
│   ├── admin/              # Área administrativa (professores)
│   ├── auth/               # Páginas de autenticação
│   ├── profile/            # Páginas de perfil
│   └── globals.css         # Estilos globais
├── components/             # Componentes React reutilizáveis
├── context/                # Contextos React (auth, tema)
├── lib/                    # Utilitários e funções auxiliares
├── public/                 # Arquivos estáticos
├── src/                    # Código do backend
│   ├── controllers/        # Controladores da API
│   ├── middlewares/        # Middlewares Express
│   ├── models/             # Modelos Mongoose
│   ├── routes/             # Rotas da API
│   ├── services/           # Serviços
│   ├── utils/              # Utilitários
│   └── server.ts           # Ponto de entrada do servidor
├── scripts/                # Scripts utilitários
├── types/                  # Definições de tipos TypeScript
├── .env.example            # Exemplo de variáveis de ambiente
├── next.config.mjs         # Configuração do Next.js
├── package.json            # Dependências e scripts
├── tsconfig.json           # Configuração do TypeScript
└── vercel.json             # Configuração de deploy na Vercel

```plaintext

## 🔧 Requisitos de Sistema

- Node.js 18.x ou superior
- MongoDB 4.4 ou superior
- NPM 8.x ou superior
- Conta na Vercel (para Blob Storage)

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/MvsHub/EduConnect.git
cd EduConnect
```

### 2. Instale as dependências

```shellscript
# Instalar dependências do projeto (frontend e backend)
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```shellscript
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```plaintext
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/educational-platform?retryWrites=true&w=majority
JWT_SECRET=seu_jwt_secret_key
BLOB_READ_WRITE_TOKEN=seu_vercel_blob_token
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Inicialize o banco de dados com dados de exemplo (opcional)

```shellscript
# Compilar o TypeScript do backend
npm run build

# Executar o script de seed
npm run seed
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento

Para executar o projeto em modo de desenvolvimento:

```shellscript
# Terminal 1: Executar o backend
npm run dev

# Terminal 2: Executar o frontend (em outro terminal)
npm run dev:frontend
```

Acesse:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001/api](http://localhost:3001/api)


### Produção

Para build de produção:

```shellscript
# Build do frontend e backend
npm run build

# Iniciar em modo produção
npm start
```

## 📡 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/refresh-token` - Renovar token de acesso
- `POST /api/auth/logout` - Logout de usuário


### Usuários

- `GET /api/users/:id` - Obter perfil de usuário
- `PUT /api/users/profile` - Atualizar perfil de usuário


### Posts

- `GET /api/posts` - Listar todos os posts
- `GET /api/posts/:id` - Obter post específico
- `GET /api/posts/user/:userId` - Listar posts de um usuário
- `POST /api/posts` - Criar novo post (apenas professores)
- `PUT /api/posts/:id` - Atualizar post
- `DELETE /api/posts/:id` - Excluir post
- `POST /api/posts/:id/like` - Curtir/descurtir post


### Comentários

- `GET /api/comments/post/:postId` - Listar comentários de um post
- `POST /api/comments/post/:postId` - Adicionar comentário
- `DELETE /api/comments/:id` - Excluir comentário


### Upload

- `POST /api/upload` - Upload de imagem


## 👥 Usuários de Teste

Após executar o script de seed, você terá acesso aos seguintes usuários:

### Professor

- **Email**: [teacher@example.com](mailto:teacher@example.com)
- **Senha**: password123


### Aluno

- **Email**: [student@example.com](mailto:student@example.com)
- **Senha**: password123


## 🧪 Testes:

# Executar testes
npm test

Thought for 1 secondAqui está o conteúdo completo do README.md que você pode copiar e salvar diretamente em um arquivo:

```markdown
# EduConnect

![EduConnect Logo](/placeholder.svg?height=200&width=400)

## 📚 Sobre o Projeto

EduConnect é uma plataforma educacional que conecta professores e alunos através de um ambiente interativo de compartilhamento de conteúdo. A plataforma permite que professores publiquem materiais educacionais, enquanto os alunos podem interagir através de comentários e curtidas.

## ✨ Funcionalidades

### Gerais
- 🔐 Sistema de autenticação e autorização
- 👤 Perfis de usuário (professor e aluno)
- 🌓 Suporte a tema claro/escuro

### Para Professores
- 📝 Criação, edição e exclusão de posts educacionais
- 📊 Painel administrativo para gerenciar conteúdo
- 📷 Upload de imagens para posts

### Para Alunos
- 📚 Feed de conteúdo educacional
- 💬 Comentários em posts
- ❤️ Curtidas em posts
- 👀 Visualização de perfis de outros usuários

### Perfil de Usuário
- ✏️ Edição de informações pessoais
- 🖼️ Upload de foto de perfil
- 📋 Visualização de histórico de posts

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** (App Router) - Framework React para renderização híbrida
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de UI reutilizáveis
- **date-fns** - Biblioteca para manipulação de datas
- **Lucide React** - Ícones modernos para React

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para Node.js
- **TypeScript** - Superset tipado de JavaScript
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação baseada em tokens
- **Bcrypt** - Hashing de senhas
- **Multer** - Middleware para upload de arquivos
- **Vercel Blob Storage** - Armazenamento de imagens
- **Winston** - Sistema de logging
- **Joi** - Validação de dados

## 📁 Estrutura do Projeto

```

EduConnect/
├── app/                    # Páginas e rotas do Next.js
│   ├── admin/              # Área administrativa (professores)
│   ├── auth/               # Páginas de autenticação
│   ├── profile/            # Páginas de perfil
│   └── globals.css         # Estilos globais
├── components/             # Componentes React reutilizáveis
├── context/                # Contextos React (auth, tema)
├── lib/                    # Utilitários e funções auxiliares
├── public/                 # Arquivos estáticos
├── src/                    # Código do backend
│   ├── controllers/        # Controladores da API
│   ├── middlewares/        # Middlewares Express
│   ├── models/             # Modelos Mongoose
│   ├── routes/             # Rotas da API
│   ├── services/           # Serviços
│   ├── utils/              # Utilitários
│   └── server.ts           # Ponto de entrada do servidor
├── scripts/                # Scripts utilitários
├── types/                  # Definições de tipos TypeScript
├── .env.example            # Exemplo de variáveis de ambiente
├── next.config.mjs         # Configuração do Next.js
├── package.json            # Dependências e scripts
├── tsconfig.json           # Configuração do TypeScript
└── vercel.json             # Configuração de deploy na Vercel

```plaintext

## 🔧 Requisitos de Sistema

- Node.js 18.x ou superior
- MongoDB 4.4 ou superior
- NPM 8.x ou superior
- Conta na Vercel (para Blob Storage)

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/MvsHub/EduConnect.git
cd EduConnect
```

### 2. Instale as dependências

```shellscript
# Instalar dependências do projeto (frontend e backend)
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```shellscript
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```plaintext
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/educational-platform?retryWrites=true&w=majority
JWT_SECRET=seu_jwt_secret_key
BLOB_READ_WRITE_TOKEN=seu_vercel_blob_token
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Inicialize o banco de dados com dados de exemplo (opcional)

```shellscript
# Compilar o TypeScript do backend
npm run build

# Executar o script de seed
npm run seed
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento

Para executar o projeto em modo de desenvolvimento:

```shellscript
# Terminal 1: Executar o backend
npm run dev

# Terminal 2: Executar o frontend (em outro terminal)
npm run dev:frontend
```

Acesse:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001/api](http://localhost:3001/api)


### Produção

Para build de produção:

```shellscript
# Build do frontend e backend
npm run build

# Iniciar em modo produção
npm start
```

## 📡 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/refresh-token` - Renovar token de acesso
- `POST /api/auth/logout` - Logout de usuário


### Usuários

- `GET /api/users/:id` - Obter perfil de usuário
- `PUT /api/users/profile` - Atualizar perfil de usuário


### Posts

- `GET /api/posts` - Listar todos os posts
- `GET /api/posts/:id` - Obter post específico
- `GET /api/posts/user/:userId` - Listar posts de um usuário
- `POST /api/posts` - Criar novo post (apenas professores)
- `PUT /api/posts/:id` - Atualizar post
- `DELETE /api/posts/:id` - Excluir post
- `POST /api/posts/:id/like` - Curtir/descurtir post


### Comentários

- `GET /api/comments/post/:postId` - Listar comentários de um post
- `POST /api/comments/post/:postId` - Adicionar comentário
- `DELETE /api/comments/:id` - Excluir comentário


### Upload

- `POST /api/upload` - Upload de imagem


## 👥 Usuários de Teste

Após executar o script de seed, você terá acesso aos seguintes usuários:

### Professor

- **Email**: [teacher@example.com](mailto:teacher@example.com)
- **Senha**: password123


### Aluno

- **Email**: [student@example.com](mailto:student@example.com)
- **Senha**: password123


## 🧪 Testes

```shellscript
# Executar testes
npm test
```

## 🔍 Solução de Problemas

### Problemas comuns:

1. **Erro de conexão com MongoDB**:

1. Verifique se a string de conexão está correta
2. Certifique-se de que seu IP está na lista de permissões do MongoDB Atlas



2. **Erro no upload de imagens**:

1. Verifique se o token do Vercel Blob está configurado corretamente
2. Certifique-se de que o tamanho da imagem não excede 5MB



3. **Erro de CORS**:

1. Em desenvolvimento, certifique-se de que as URLs do frontend e backend estão configuradas corretamente





## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, sinta-se à vontade para enviar um Pull Request.

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

