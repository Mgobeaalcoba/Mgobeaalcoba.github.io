import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

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
      {
        src: '/images/app-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/app-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/app-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      { name: 'Soluciones', short_name: 'Soluciones', url: '/#soluciones' },
      { name: 'Blog', short_name: 'Blog', url: '/blog/' },
      { name: 'Herramientas', short_name: 'Herramientas', url: '/recursos/' },
    ],
  };
}
