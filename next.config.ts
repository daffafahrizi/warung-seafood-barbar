/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Tanda ** artinya semua project Supabase diizinkan
      },
    ],
  },
};

module.exports = nextConfig;