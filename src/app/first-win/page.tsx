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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            Stop Watching AI Demos.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-500">
              Ship Your First Build.
            </span>
          </h1>
          
          <div className="space-y-4 text-lg sm:text-xl text-gray-600">
            <p>You&apos;ve seen what&apos;s possible with AI tools.</p>
            <p>You know you could build something valuable.</p>
            <p>But you&apos;re stuck in tool paralysis and tutorial hell.</p>
          </div>
        </div>

        {/* Truth Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Here&apos;s the truth:</h2>
          <ul className="space-y-6 text-lg">
            <li className="flex items-center text-gray-600">
              <span className="mr-3 text-emerald-500">✓</span>
              You don&apos;t need to master 50 different tools.
            </li>
            <li className="flex items-center text-gray-600">
              <span className="mr-3 text-emerald-500">✓</span>
              You don&apos;t need to become an AI expert.
            </li>
            <li className="flex items-center text-gray-600">
              <span className="mr-3 text-emerald-500">✓</span>
              You don&apos;t need months of learning.
            </li>
            <li className="flex items-center font-semibold text-gray-900">
              <span className="mr-3 text-emerald-500">★</span>
              You need your first win.
            </li>
          </ul>
        </div>

        {/* Value Proposition */}
        <div className="text-center mb-16">
          <p className="text-xl sm:text-2xl text-gray-700 max-w-2xl mx-auto">
            In just 3 hours, go from overwhelmed to shipping your first AI-powered prototype.
            <span className="block mt-2 text-emerald-600 font-medium">No coding required.</span>
          </p>
        </div>

        {/* Benefits */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-lg">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600">→</span>
              <span>Watch real builds happen step-by-step</span>
            </div>
            <div className="flex items-center space-x-4 text-lg">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600">→</span>
              <span>Get past analysis paralysis</span>
            </div>
            <div className="flex items-center space-x-4 text-lg">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600">→</span>
              <span>Ship something that actually works</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-600">Join the waitlist to:</p>
          </div>
          
          <ul className="max-w-md mx-auto mb-8 space-y-4 text-gray-600">
            <li className="flex items-center">
              <span className="mr-3 text-emerald-500">•</span>
              Get early access when I launch
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-emerald-500">•</span>
              Receive exclusive AI building tips
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-emerald-500">•</span>
              Lock in founding member pricing
            </li>
          </ul>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                className="px-8 py-3 text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Joining...' : 'Join'}
              </button>
            </div>
            {message && (
              <p className={`text-sm text-center mt-4 ${status === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            For product managers, founders, and professionals ready to stop watching demos and start shipping.
          </p>
        </div>
      </div>
    </div>
  );
}
