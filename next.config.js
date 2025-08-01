/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  experimental: {
    serverComponentsExternalPackages: ['gray-matter', 'remark', 'remark-html']
  }
}

module.exports = nextConfig