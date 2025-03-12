import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Dynamic routes will be handled by your application logic
    // The [id] route represents individual palette results
    {
      url: `${baseUrl}/example-palette-id`, // This is a sample URL, actual IDs will be dynamic
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }
  ];
} 