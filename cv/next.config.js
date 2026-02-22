/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/cv-site',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
