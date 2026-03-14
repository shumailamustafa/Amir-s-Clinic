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
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.infrastructureLogging = {
        level: 'error',
        debug: /PackFileCache/,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
