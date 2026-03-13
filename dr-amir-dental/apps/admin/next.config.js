/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@dental/ui',
    '@dental/theme',
    '@dental/firebase',
    '@dental/utils',
    '@dental/types',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

module.exports = nextConfig;
