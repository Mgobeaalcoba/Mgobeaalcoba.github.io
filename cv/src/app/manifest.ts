import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MGA Tech Consulting',
    short_name: 'MGA',
    description: 'Soluciones, portfolio, blog técnico y herramientas de MGA Tech Consulting.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070b12',
    theme_color: '#070b12',
    orientation: 'portrait-primary',
    categories: ['business', 'productivity', 'education'],
    icons: [
      { src: '/images/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcuts: [
      { name: 'Soluciones', short_name: 'Soluciones', url: '/#soluciones' },
      { name: 'Blog', short_name: 'Blog', url: '/blog/' },
      { name: 'Herramientas', short_name: 'Herramientas', url: '/recursos/' },
    ],
  };
}
