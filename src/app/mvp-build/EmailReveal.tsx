'use client'

import { useState } from 'react'

export default function EmailReveal() {
  const [showEmail, setShowEmail] = useState(false)
  const [copied, setCopied] = useState(false)
  const email = 'alex@stener.co.uk'

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="pt-6 space-y-4">
      <button
        onClick={() => setShowEmail(!showEmail)}
        className="inline-flex items-center px-6 py-3.5 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all duration-200 ease-in-out"
      >
        {showEmail ? 'Hide Email' : 'Get in Touch'}
        <svg
          className={`w-4 h-4 ml-2 -mr-1 transition-transform duration-200 ${showEmail ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div className={`transform transition-all duration-300 ease-in-out overflow-hidden ${showEmail ? 'opacity-100 max-h-20 translate-y-0' : 'opacity-0 max-h-0 -translate-y-4'}`}>
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {email}
          </span>
          <button
            onClick={copyEmail}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            {copied ? (
              <span className="text-green-600 dark:text-green-400">Copied!</span>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 