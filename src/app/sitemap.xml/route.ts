import { getPosts } from '@/lib/blog'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  const posts = await getPosts()
  
  // Create XML string
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>https://stener.co.uk</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://stener.co.uk/posts</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`

  // Add blog posts with video information
  for (const post of posts) {
    const filePath = path.join(process.cwd(), 'content/posts', `${post.slug}.md`)
    const fileContent = await fs.readFile(filePath, 'utf8')
    const content = fileContent.toString()
    
    // Extract YouTube video ID if present
    const videoMatch = content.match(/youtube.com\/embed\/([a-zA-Z0-9_-]+)/)
    const videoId = videoMatch ? videoMatch[1] : null

    xml += `
  <url>
    <loc>https://stener.co.uk/posts/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>`

    if (videoId) {
      xml += `
    <video:video>
      <video:thumbnail_loc>https://img.youtube.com/vi/${videoId}/maxresdefault.jpg</video:thumbnail_loc>
      <video:title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</video:title>
      <video:description>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</video:description>
      <video:player_loc>https://www.youtube.com/embed/${videoId}</video:player_loc>
      <video:duration>300</video:duration>
      <video:publication_date>${new Date(post.date).toISOString()}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>`
    }

    xml += `
  </url>`
  }

  xml += `
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600',
    },
  })
} 