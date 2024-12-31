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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center space-y-16">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-gray-900">
              Yo, I&apos;m{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-500">
                Alex
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-xl mx-auto leading-relaxed">
              I&apos;m building with AI and no code and sharing my learnings along the way.
            </p>
          </div>

          {/* Newsletter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 max-w-xl mx-auto">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">Stay Updated</h2>
                <p className="text-gray-600">
                  Join my newsletter for weekly insights on building with AI and no-code tools.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 min-w-0 px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    required
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
                    className="px-8 py-3 text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                {message && (
                  <p className={`text-sm text-center ${status === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}
                <p className="text-sm text-gray-500 text-center">
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>

          {/* Featured Content */}
          <div className="max-w-xl mx-auto">
            <a 
              href="/first-win"
              className="block p-6 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors duration-200"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-600">Coming soon</span>
                  <span className="text-sm text-emerald-600">→</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Stop Watching AI Demos</h3>
                <p className="text-gray-600">Your first win. Learn how to ship your first AI-powered prototype in just 3 hours.</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
