'use client';
import React from 'react';

export default function ConvertKitForm() {
  return (
    <div className="bg-gray-50 rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-4">Keep in the loop</h2>
      <p className="text-gray-600 mb-6">
        Signup for launch access + quick-wins to your inbox
      </p>
      <form
        action="https://app.convertkit.com/forms/YOUR_FORM_ID/subscriptions"
        method="post"
        className="space-y-4"
      >
        <div>
          <input
            type="email"
            name="email_address"
            placeholder="Email Address"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Subscribe
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Unsubscribe at any time.
      </p>
    </div>
  );
}
