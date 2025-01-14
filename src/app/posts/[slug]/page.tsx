'use server';
import { getPost, getPosts } from '@/lib/blog'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ConvertKitForm from '@/app/components/ConvertKitForm'

type BlogPostParams = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({ params }: BlogPostParams) {
  const { slug } = params
  const post = await getPost(slug)
  
  if (!post) {
    notFound()
  }
  
  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <Link href="/posts" className="text-blue-600 hover:underline mb-16 block">
        ← All posts
      </Link>
      <article className="prose lg:prose-l">
        <h1>{post.title}</h1>
        <div 
          dangerouslySetInnerHTML={{ 
            __html: post.content.replace(/<h1>.*?<\/h1>/, '') // Remove the H1 from content
          }} 
        />
      </article>
      
      <div className="mt-8 pt-8 border-t">
        <ConvertKitForm />
      </div>
    </main>
  )
}
