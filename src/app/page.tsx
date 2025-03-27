import React from 'react';
import ConvertKitForm from './components/ConvertKitForm';
import Link from 'next/link';
import { getPosts } from '@/lib/blog';

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">
          Yo, I&apos;m Alex
        </h1>
        
        <div>
          <p className="text-base">
            I&apos;m building with AI and no-code. Sharing my learnings
          </p>
          <p className="mb-10 text-base">
            Find me on{" "}
            <a href="https://twitter.com/alexchristou_" className="underline hover:text-gray-600" target="_blank" rel="noopener noreferrer">X</a>
            {" "}and{" "}
            <a href="https://www.youtube.com/@alexchristou_" className="underline hover:text-gray-600" target="_blank" rel="noopener noreferrer">YouTube</a>
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-pink-500">ALL ARTICLES</h2>
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li key={post.slug} className="flex items-start">
                    <span className="text-pink-500 mr-2 mt-1">―</span>
                    <Link 
                      href={`/posts/${post.slug}`}
                      className="text-base hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 border-t">
              <ConvertKitForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
