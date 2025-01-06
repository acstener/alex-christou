'use client';
import React from 'react';

export default function Home() {
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
          Yo, I&apos;m Alex
        </h1>
        
        <div className="text-lg">
          <p>
            I&apos;m building with AI and no code and sharing my learnings.
          </p>
          <p className="mb-6">
              Find me on{" "}
              <a href="https://twitter.com/alexchristou_" className="underline hover:text-gray-600" target="_blank" rel="noopener noreferrer">X</a>
              {" "}and{" "}
              <a href="https://www.youtube.com/@alexchristou_" className="underline hover:text-gray-600" target="_blank" rel="noopener noreferrer">YouTube</a>
            </p>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-4">Join the newsletter for quick-wins on building with AI and no-code.</p>
            
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
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
              {message && (
                <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
              <p className="text-sm text-gray-500">
                No rubbish. Unsubscribe anytime.
              </p>
            </form>
          </div>

          <div className="mt-16 pt-16 border-t">
            <a href="/first-win" className="block space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Coming soon</span>
                <span>→</span>
              </div>
              <h3 className="text-xl font-bold">Stop Watching AI Demos</h3>
              <p>Your first win. Learn how to ship your first AI-powered prototype in hours.</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
