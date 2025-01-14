'use client';
import React from 'react';
import ConvertKitForm from './components/ConvertKitForm';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-12">
          Yo, I&apos;m Alex
        </h1>
        
        <div className="text-lg">
          <p>
            I&apos;m building with AI and no-code. Sharing my learnings
          </p>
          <p className="mb-6">
            Find me on{" "}
            <a href="https://twitter.com/alexchristou_" className="underline hover:text-gray-600" target="_blank" rel="noopener noreferrer">X</a>
            {" "}and{" "}
            <a href="https://www.youtube.com/@alexchristou_" className="underline hover:text-gray-600" target="_blank" rel="noopener noreferrer">YouTube</a>
          </p>

          <div className="mt-8">
            <ConvertKitForm />
          </div>

          <div className="mt-16 pt-16 border-t space-y-16">
            <a href="/first-win" className="block space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Coming soon</span>
                <span>→</span>
              </div>
              <h3 className="text-xl font-bold">Stop Watching AI Demos</h3>
              <p>Your first win. Learn how to ship your first AI-powered prototype in hours.</p>
            </a>

            <Link href="/posts" className="block space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Blog</span>
                <span>→</span>
              </div>
              <h3 className="text-xl font-bold">Check out some of the recent posts</h3>
              <p>Thoughts and learnings about AI andno-code</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
