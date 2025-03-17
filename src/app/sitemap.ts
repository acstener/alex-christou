import { getPosts } from '@/lib/blog'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts
  const posts = await getPosts()
  
  // Create sitemap entries for blog posts
  const postEntries = posts.map((post) => ({
    url: `https://stener.co.uk/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Base routes
  const routes = [
    {
      url: 'https://stener.co.uk',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://stener.co.uk/posts',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]

  return [...routes, ...postEntries]
} 