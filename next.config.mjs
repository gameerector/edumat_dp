/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**', // Allows all HTTP domains
      },
    ],
    formats: ['image/webp', 'image/avif'], // Supports optimized formats
  },
};

export default nextConfig;