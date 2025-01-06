'use client';
import React from 'react';
import ConvertKitForm from '../components/ConvertKitForm';

export default function FirstWin() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-12">
          Stop watching AI demos - start building.
        </h1>
        
        <div className="space-y-6 text-lg">
          <p>
            Everyone&apos;s building with AI, right? Wrong.
            <br />
            99% are just collecting Twitter threads.
          </p>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Let&apos;s be real:</h2>
            <ul className="list-none space-y-2">
              <li>- You&apos;re drowning in AI tools</li>
              <li>- You don&apos;t know where to start</li>
              <li>- You haven&apos;t shipped anything</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Imagine Instead:</h2>
            <ul className="list-none space-y-2">
              <li>- Having your go-to AI toolkit that just works</li>
              <li>- Actually shipping AI products in hours, not minutes</li>
              <li>- Being the one showing demos, not watching them</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Here&apos;s the deal:</h2>
            <p>
              I&apos;ve been building with no-code for 6+ years - shipping client projects, helping scale a startup to millions of users, and launching revenue-generating side projects.
            </p>
            <p className="mt-4">
              Now with AI, there&apos;s never been a better time to get in. But you need a clear path, not more tutorials.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Three projects you&apos;ll actually ship:</h2>
            <ul className="list-none space-y-4">
              <li>
                <p className="font-bold">- Smart Recipe Finder (60 min)</p>
                <p className="ml-4">Build your first AI-powered search in an hour</p>
              </li>
              <li>
                <p className="font-bold">- Customer Service Bot (60 min)</p>
                <p className="ml-4">Train AI on your own data, ship a working chatbot</p>
              </li>
              <li>
                <p className="font-bold">- AI Agents (60 min)</p>
                <p className="ml-4">Create agents that actually get work done</p>
              </li>
            </ul>
          </div>
          
          <p className="text-xl font-bold">
            No beating around the bush - Just follow along and ship.
          </p>

          <p className="text-xl">
            Launching soon. Sign up to stay in the loop
          </p>

          <div className="mt-16 pt-8 border-t">
            <ConvertKitForm />
          </div>
        </div>
      </div>
    </div>
  );
}
