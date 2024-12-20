/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['firebasestorage.googleapis.com'],  // Allow Firebase image domain
      },
};

export default nextConfig;
