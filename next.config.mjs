/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['randomuser.me', 'miro.medium.com', 'vercel-blob.com'],
  },
  // Adicione esta configuração para resolver problemas de compatibilidade
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
