'use client';
import React from 'react';

export default function FirstWin() {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with email:', email);
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter an email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      console.log('Making API request...');
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage(data.message || 'Successfully subscribed!');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

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
        </div>

        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6">V1 Coming soon</h2>
          <p className="mb-6">→ Signup for launch access + quick-wins to your inbox</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setMessage('');
                }
              }}
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
            </button>
            {message && (
              <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
