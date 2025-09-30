/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.example.com", // ✅ your actual image host
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", // if you also use pexels images
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", 
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
