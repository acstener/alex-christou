# WebStyle Implementation Guide - Phase 2

In this phase, we'll integrate the actual ScreenshotOne API and Vision AI, and enhance the UI to properly display the results.

## 1. API Keys Setup

First, update your `.env.local` file with actual API keys:

```bash
# API Keys
SCREENSHOT_API_KEY=1B3JZ-VnG6OTpA
OPENAI_API_KEY=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
```

## 2. Enhance the Screenshot API Route

Update `src/app/api/screenshot/route.ts` to integrate with the ScreenshotOne API:

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { url } = await request.json();
  
  // Validate URL
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  
  try {
    // Call ScreenshotOne API with your access key
    const accessKey = process.env.SCREENSHOT_API_KEY; // This is "1B3JZ-VnG6OTpA"
    const screenshotUrl = new URL('https://api.screenshotone.com/take');
    
    // Add query parameters as per the ScreenshotOne documentation
    screenshotUrl.searchParams.append('access_key', accessKey as string);
    screenshotUrl.searchParams.append('url', url);
    screenshotUrl.searchParams.append('format', 'jpg');
    screenshotUrl.searchParams.append('viewport_width', '1280');
    screenshotUrl.searchParams.append('viewport_height', '800');
    screenshotUrl.searchParams.append('response_type', 'json'); // Get both image and metadata
    
    console.log('Requesting screenshot from:', screenshotUrl.toString());
    
    const screenshotResponse = await fetch(screenshotUrl.toString(), {
      method: 'GET',
    });
    
    if (!screenshotResponse.ok) {
      const errorData = await screenshotResponse.json().catch(() => ({}));
      console.error('Screenshot API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to capture screenshot' }, 
        { status: 500 }
      );
    }
    
    const screenshotData = await screenshotResponse.json();
    console.log('Screenshot API response:', screenshotData);
    
    // For Phase 2, we'll just return the screenshot data
    // In Phase 3, we'll integrate Vision AI
    return NextResponse.json({
      success: true,
      screenshot: screenshotData.url,
      metadata: {
        url: url,
        capturedAt: new Date().toISOString()
      }
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

## 3. Enhance the WebStyleForm Component

Update `src/components/WebStyleForm.tsx` to display the screenshot:

```typescript
'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, Download, Copy } from 'lucide-react';

export default function WebStyleForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    screenshot?: string;
    styleGuide?: string;
    metadata?: any;
  } | null>(null);
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
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle image download
  const handleDownload = () => {
    if (result?.screenshot) {
      const link = document.createElement('a');
      link.href = result.screenshot;
      link.download = `${url.replace(/[^a-z0-9]/gi, '_')}_screenshot.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

      {result?.screenshot && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Website Screenshot</h3>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <Download className="h-4 w-4" /> Save Image
            </button>
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <img 
              src={result.screenshot} 
              alt="Website Screenshot" 
              className="w-full h-auto"
            />
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Source URL: {url}</p>
            <p>Captured: {result.metadata?.capturedAt ? new Date(result.metadata.capturedAt).toLocaleString() : 'Unknown'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 4. Testing Phase 2

1. Make sure you've updated the `.env.local` file with your actual ScreenshotOne API key
2. Start your development server:
   ```bash
   npm run dev
   ```
3. Navigate to `http://localhost:3000/webstyle`
4. Test the form by entering a URL and submitting it
5. Verify that the API returns an actual screenshot and displays it in the UI

## 5. Expected Results for Phase 2

At the end of Phase 2, you should have:

- A working integration with the ScreenshotOne API
- The ability to capture screenshots of any website
- A UI that displays the captured screenshot with metadata
- Option to download the screenshot

## Next Steps (For Phase 3)

- Integrate with Vision AI to analyze screenshots and generate style guides
- Enhance the UI to display style guides in a user-friendly way
- Add copy-to-clipboard functionality for the style guide

## Troubleshooting Phase 2

- If you receive a 401 or 403 error, verify your ScreenshotOne API key
- If screenshots aren't loading, check the console for any CORS issues
- If the API response is unexpected, log the raw response for debugging