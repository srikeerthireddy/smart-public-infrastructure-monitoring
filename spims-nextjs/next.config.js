/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Vercel deployment
  output: 'standalone',
  // Disable static optimization for dynamic pages
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig