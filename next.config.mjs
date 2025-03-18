/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["randomuser.me", "miro.medium.com", "vercel-blob.com"],
  },
};

export default nextConfig;
