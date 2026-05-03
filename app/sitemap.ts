import { MetadataRoute } from 'next'

// TODO: Replace with your actual production domain
const SITE_URL = 'https://nadavai.co.il'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
