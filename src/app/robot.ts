import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart'],
    },
    sitemap: 'https://reveillerstudios.com/sitemap.xml',
  };
}