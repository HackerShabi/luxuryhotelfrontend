/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'localhost'],
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://luxuryhotels.vercel.app/api'
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'production') {
      return []
    }
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig