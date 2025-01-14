import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { promises as fs } from 'fs'
import path from 'path'

const md = new MarkdownIt({ html: true })
const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface BlogPost {
  slug: string
  title: string
  date: string
  content: string
}

export async function getPosts() {
  // Create posts directory if it doesn't exist
  try {
    await fs.mkdir(postsDirectory, { recursive: true })
  } catch (error) {
    // Directory already exists, ignore error
  }

  // Read all files from the posts directory
  const files = await fs.readdir(postsDirectory)
  const markdownFiles = files.filter(file => file.endsWith('.md'))

  const posts = await Promise.all(
    markdownFiles.map(async filename => {
      const filePath = path.join(postsDirectory, filename)
      const fileContent = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(fileContent)
      const slug = filename.replace('.md', '')

      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        content: md.render(content)
      }
    })
  )

  // Sort posts by date, newest first
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPost(slug: string) {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`)
    const fileContent = await fs.readFile(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      content: md.render(content)
    }
  } catch (error) {
    return null
  }
}
