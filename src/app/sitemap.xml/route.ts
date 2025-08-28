import { MetadataRoute } from 'next';

export async function GET(): Promise<MetadataRoute.Sitemap> {

  const staticRoutes = [
    { url: 'https://reveillerstudios.com/', lastModified: new Date() },
    { url: 'https://reveillerstudios.com/about', lastModified: new Date() },
    { url: 'https://reveillerstudios.com/contact', lastModified: new Date() },
    { url: 'https://reveillerstudios.com/products', lastModified: new Date() },
  ];

  return [...staticRoutes];
}