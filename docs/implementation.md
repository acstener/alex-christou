# WebStyle Implementation Guide - Phase 1

This guide covers the initial implementation of the WebStyle tool, focusing on setting up the core infrastructure, API routes, and a minimal UI that matches your existing website style.

## 1. Project Structure Setup

First, create the necessary directories and files:

```bash
# Create component directory if it doesn't exist
mkdir -p src/components

# Create API route directories
mkdir -p src/app/api/screenshot

# Create page route for the tool
mkdir -p src/app/webstyle
```

## 2. API Route Implementation

Create the basic screenshot API endpoint:

### 2.1. Create the Screenshot API Route

Create `src/app/api/screenshot/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { url } = await request.json();
  
  // Validate URL
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  
  try {
    // For Phase 1, we'll just return a mock response
    // This will be replaced with actual ScreenshotOne API in Phase 2
    return NextResponse.json({
      success: true,
      message: 'API route working correctly',
      url: url,
      // In Phase 2, we'll return actual screenshot and style guide
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}
```

## 3. Environment Configuration

### 3.1. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# API Keys - will be used in Phase 2
SCREENSHOT_API_KEY=placeholder_for_phase_1
OPENAI_API_KEY=placeholder_for_phase_1
```

## 4. UI Component Implementation

### 4.1. Create URL Input Component

Create `src/components/WebStyleForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function WebStyleForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process website');
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            required
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Processing...
              </>
            ) : (
              <>
                Generate <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {response && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2">API Response (Phase 1 Debug)</h3>
          <pre className="bg-white border border-gray-300 rounded-lg p-4 overflow-x-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
```

### 4.2. Create Page Component

Create `src/app/webstyle/page.tsx`:

```typescript
import WebStyleForm from '@/components/WebStyleForm';

export const metadata = {
  title: 'WebStyle - Design Style Guide Generator',
  description: 'Generate design style guides from websites with AI',
};

export default function WebStylePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">WebStyle</h1>
        <p className="text-gray-600 mb-8">Generate design style guides from websites with AI</p>
        
        <WebStyleForm />
      </div>
    </main>
  );
}
```

## 5. Testing Phase 1

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/webstyle`

3. Test the form by entering a URL and submitting it

4. Verify that the API route is working correctly by checking the response in the UI

## 6. Expected Results for Phase 1

At the end of Phase 1, you should have:

- A working page at `/webstyle` with a form to input a website URL
- A basic API endpoint at `/api/screenshot` that receives the URL and returns a placeholder response
- A clean UI that matches your website's existing style
- Error handling for basic validation issues

## Next Steps (For Phase 2)

- Integrate with ScreenshotOne API to capture actual screenshots
- Integrate with Vision AI to analyze screenshots and generate style guides
- Enhance UI to display screenshots and style guides in a user-friendly way

## Troubleshooting Phase 1

- If the API route returns 404, ensure that your Next.js app router is set up correctly
- If the form doesn't submit, check browser console for errors
- If styling doesn't match your existing site, you may need to adjust the Tailwind classes 