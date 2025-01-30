'use server';
import { getPost, getPosts } from '@/lib/blog'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ConvertKitForm from '@/app/components/ConvertKitForm'
import { Metadata } from 'next'
import Script from 'next/script'

type BlogPostParams = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: BlogPostParams): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found'
    }
  }

  return {
    title: `${post.title} | Alex Christou`,
    description: post.content.slice(0, 155).replace(/<[^>]*>/g, ''), // Strip HTML and limit to 155 chars
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 155).replace(/<[^>]*>/g, ''),
      type: 'article',
      publishedTime: post.date,
      authors: ['Alex Christou'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content.slice(0, 155).replace(/<[^>]*>/g, ''),
      creator: '@alexchristou_'
    }
  }
}

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Alex Christou',
      url: 'https://twitter.com/alexchristou_'
    },
    description: post.content.slice(0, 155).replace(/<[^>]*>/g, ''),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://alexchristou.com/posts/${slug}`
    }
  }
  
  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <Script id="json-ld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
      <Link href="/posts" className="text-blue-600 hover:underline mb-16 block">
        ← All posts
      </Link>
      <article className="prose lg:prose-l">
        <h1>{post.title}</h1>
        <time dateTime={post.date} className="text-gray-500 block mb-8">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        <div 
          dangerouslySetInnerHTML={{ 
            __html: post.content.replace(/<h1>.*?<\/h1>/, '')
          }} 
        />
      </article>
      
      <div className="mt-8 pt-8 border-t">
        <ConvertKitForm />
      </div>
    </main>
  )
}
