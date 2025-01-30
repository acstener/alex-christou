import Link from 'next/link'
import { getPosts } from '@/lib/blog'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Posts | Alex Christou',
  description: 'Thoughts and learnings about AI and no-code development, product building, and tech entrepreneurship.',
  openGraph: {
    title: 'Blog Posts | Alex Christou',
    description: 'Thoughts and learnings about AI and no-code development, product building, and tech entrepreneurship.',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Blog Posts | Alex Christou',
    description: 'Thoughts and learnings about AI and no-code development, product building, and tech entrepreneurship.',
    creator: '@alexchristou_'
  }
}

export default async function PostsPage() {
  const posts = await getPosts()
  
  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <Link href="/" className="text-blue-600 hover:underline mb-8 block">
        ← Back home
      </Link>
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-8">
        {posts.map(post => (
          <article key={post.slug} className="border-b pb-8">
            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-xl hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
            </Link>
            <time className="text-gray-500 text-sm">
              {new Date(post.date).toLocaleDateString()}
            </time>
          </article>
        ))}
      </div>
    </main>
  )
}
