/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/neil-site',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
