/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/elportugues-site',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
