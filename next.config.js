/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-e29c0247fb7649ce98590df7640d058a.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'surequinos.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.surequinos.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig