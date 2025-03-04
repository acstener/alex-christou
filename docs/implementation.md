# WebStyle Implementation Guide - Phase 3 (Two-Step API Approach)

In this phase, we'll integrate Vision AI to analyze screenshots and generate design style guides using a two-step API approach to avoid Vercel timeout issues.

## 1. Create Two Separate API Routes

### 1.1. Update Screenshot API Route

First, update your existing screenshot API route to only handle capturing the screenshot:

```typescript
// src/app/api/screenshot/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { url } = await request.json();
  
  // Validate URL
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  
  try {
    // Call ScreenshotOne API with your access key
    const accessKey = process.env.SCREENSHOT_API_KEY; // "1B3JZ-VnG6OTpA"
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
    const imageUrl = screenshotData.url;
    
    // Return just the screenshot URL and metadata
    return NextResponse.json({
      success: true,
      screenshot: imageUrl,
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

### 1.2. Create a Separate Analysis API Route

Create a new API route specifically for Vision AI analysis:

```typescript
// src/app/api/analyze/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { imageUrl } = await request.json();
  
  // Validate image URL
  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  }
  
  try {
    // Your custom prompt for design style guide extraction
    const promptTemplate = `
      Analyze this website screenshot and provide a comprehensive design style guide with the following elements:
      
      1. Typography System:
         - Complete type scale with exact metrics
         - Font sizes, weights, line heights, and letter spacing
         - Hierarchy and usage rules
         - Font family specifications
      
      2. Spacing & Layout:
         - Base unit and spacing scale
         - Padding and margin rules
         - Container widths and breakpoints
         - Component density specifications
         - Content-to-padding ratios
         - Layout grid system
      
      3. Component Specifications:
         - Detailed measurements for common components
         - Internal spacing rules
         - States and variations
         - Visual treatments (shadows, borders, etc.)
      
      4. Color System:
         - Complete color palette with hex codes
         - Opacity variations
         - Usage guidelines for each color
         - State colors (hover, active, disabled)
      
      5. Visual Hierarchy:
         - Opacity levels for different content types
         - Z-index scale
         - Element stacking rules
         - Content prominence guidelines
      
      6. Motion & Animation:
         - Transition timings
         - Easing functions
         - Animation patterns
         - Interactive state behaviors
      
      7. Responsive Design:
         - Breakpoint definitions
         - Container behavior at each breakpoint
         - Component adaptation rules
         - Spacing adjustments per viewport
      
      Format this as a comprehensive design system prompt that can be used with AI design tools. Be specific and include exact values where possible (pixels, hex codes, etc.).
    `;
    
    // Log the request being made to OpenAI for debugging
    console.log('Sending request to OpenAI Vision API with image:', imageUrl);
    
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // "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"
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: promptTemplate },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 2000,  // Increased token limit for more detailed response
        temperature: 0.7   // Balanced between creativity and consistency
      })
    });
    
    if (!visionResponse.ok) {
      let errorData;
      try {
        errorData = await visionResponse.json();
        console.error('Vision API error data:', errorData);
      } catch (e) {
        console.error('Error parsing Vision API error response:', e);
        errorData = { 
          status: visionResponse.status, 
          statusText: visionResponse.statusText 
        };
      }
      
      // Provide more specific error messages based on the status code
      let errorMessage = 'Failed to analyze image';
      if (visionResponse.status === 401) {
        errorMessage = 'Authentication error with Vision API. Please check your API key.';
      } else if (visionResponse.status === 429) {
        errorMessage = 'Rate limit exceeded for Vision API. Please try again later.';
      } else if (visionResponse.status === 500) {
        errorMessage = 'Vision API server error. Please try again later.';
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorData
        }, 
        { status: visionResponse.status || 500 }
      );
    }
    
    const visionData = await visionResponse.json();
    const styleGuide = visionData.choices[0].message.content;
    
    // Return the style guide
    return NextResponse.json({
      success: true,
      styleGuide
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' }, 
      { status: 500 }
    );
  }
}
```

## 2. Create StyleGuideDisplay Component

Create a dedicated component for displaying the style guide in a well-formatted way:

```typescript
// src/components/StyleGuideDisplay.tsx
import { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface StyleGuideDisplayProps {
  styleGuide: string;
}

export default function StyleGuideDisplay({ styleGuide }: StyleGuideDisplayProps) {
  const [copied, setCopied] = useState(false);
  
  // Function to copy style guide to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(styleGuide);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Function to format the style guide text with Markdown-like styling
  const formatStyleGuide = () => {
    // Split by sections (numbered items)
    const sections = styleGuide.split(/\d+\.\s+/);
    
    // Remove the first empty section if it exists
    const contentSections = sections.filter(section => section.trim().length > 0);
    
    // Extract section titles from the original text
    const sectionTitles = styleGuide.match(/\d+\.\s+([^:]+):/g) || [];
    
    return (
      <div className="space-y-6">
        {contentSections.map((section, index) => {
          // Extract section title
          const titleMatch = sectionTitles[index]?.match(/\d+\.\s+([^:]+):/) || [];
          const title = titleMatch[1] || `Section ${index + 1}`;
          
          // Format the section content
          const formattedContent = section
            .split('\n')
            .map((line, i) => {
              // Format list items
              if (line.trim().startsWith('-')) {
                return (
                  <li key={i} className="ml-6 list-disc text-gray-800">
                    {line.trim().substring(1).trim()}
                  </li>
                );
              }
              
              // Format headings (usually at the start of sections)
              if (line.trim().endsWith(':') && !line.includes('-')) {
                return (
                  <h4 key={i} className="font-medium text-gray-900 mt-4">
                    {line.trim()}
                  </h4>
                );
              }
              
              // Regular text
              return line.trim() ? (
                <p key={i} className="text-gray-700">
                  {line.trim()}
                </p>
              ) : null;
            })
            .filter(Boolean);
          
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">{title}</h3>
              <div className="space-y-2">
                {formattedContent}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Design Style Guide</h3>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy to Clipboard
            </>
          )}
        </button>
      </div>
      
      {formatStyleGuide()}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Use this style guide as a prompt with your favorite AI design tool</p>
      </div>
    </div>
  );
}
```

## 3. Create Loading State Components

Create a component for different loading states:

```typescript
// src/components/LoadingState.tsx
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  stage: 'screenshot' | 'analysis';
}

export default function LoadingState({ stage }: LoadingStateProps) {
  const message = stage === 'screenshot' 
    ? 'Capturing website screenshot...' 
    : 'Analyzing design and generating style guide...';
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-4" />
      <p className="text-gray-600 text-center">
        {message}<br />
        <span className="text-sm text-gray-500">This may take a few seconds</span>
      </p>
    </div>
  );
}
```

## 4. Update WebStyleForm Component

Update the main form component to use the two-step API approach:

```typescript
// src/components/WebStyleForm.tsx
'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, Download } from 'lucide-react';
import StyleGuideDisplay from './StyleGuideDisplay';
import LoadingState from './LoadingState';

export default function WebStyleForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'screenshot' | 'analysis' | null>(null);
  const [result, setResult] = useState<{
    screenshot?: string;
    styleGuide?: string;
    metadata?: any;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnalysisError(null);
    setLoadingStage('screenshot');
    
    try {
      // Step 1: Get the screenshot
      const screenshotResponse = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!screenshotResponse.ok) {
        const errorData = await screenshotResponse.json();
        throw new Error(errorData.error || 'Failed to capture screenshot');
      }

      const screenshotData = await screenshotResponse.json();
      
      // Store the screenshot info
      setResult({
        screenshot: screenshotData.screenshot,
        metadata: screenshotData.metadata
      });
      
      // Step 2: Process with Vision AI
      setLoadingStage('analysis');
      
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl: screenshotData.screenshot 
        }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        // We'll show the error but keep the screenshot
        setAnalysisError(errorData.error || 'Failed to analyze screenshot');
        setIsLoading(false);
        setLoadingStage(null);
        return;
      }

      const analyzeData = await analyzeResponse.json();
      
      // Update the result with the style guide
      setResult(prevResult => ({
        ...prevResult,
        styleGuide: analyzeData.styleGuide
      }));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setLoadingStage(null);
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
            disabled={isLoading}
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
          <div className="font-medium">Error</div>
          <div className="text-sm">{error}</div>
        </div>
      )}
      
      {isLoading && loadingStage && (
        <LoadingState stage={loadingStage} />
      )}
      
      {!isLoading && result && (
        <div className="space-y-6">
          {/* Screenshot Section */}
          {result.screenshot && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Website Screenshot</h3>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
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
          
          {/* Analysis Error */}
          {analysisError && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-lg">
              <div className="font-medium">Style Guide Generation Error</div>
              <div className="text-sm">{analysisError}</div>
              <div className="text-sm mt-2">
                The screenshot was captured successfully, but we couldn't generate a style guide.
              </div>
            </div>
          )}
          
          {/* Style Guide Section */}
          {result.styleGuide && (
            <StyleGuideDisplay styleGuide={result.styleGuide} />
          )}
          
          {/* Show loading for analysis if screenshot is done but style guide is pending */}
          {!analysisError && result.screenshot && !result.styleGuide && loadingStage === 'analysis' && (
            <LoadingState stage="analysis" />
          )}
        </div>
      )}
    </div>
  );
}
```

## 5. Create a Vercel Config File for Extended Timeouts

Create a `vercel.json` file in the root of your project to increase the timeout for the analyze API route:

```json
{
  "functions": {
    "app/api/analyze/route.ts": {
      "maxDuration": 60
    }
  }
}
```

This increases the timeout to 60 seconds for the analyze endpoint, which should be sufficient for the Vision AI processing.

## 6. Testing Phase 3

1. Make sure you've updated the `.env.local` file with both your ScreenshotOne and OpenAI API keys:
   ```
   SCREENSHOT_API_KEY=1B3JZ-VnG6OTpA
   OPENAI_API_KEY=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
   ```

2. Start your development server:
   ```bash
   npm run dev
   ```

3. Navigate to `http://localhost:3000/webstyle`

4. Test the form by entering a URL and submitting it

5. Verify that:
   - The screenshot appears first
   - The loading indicator shows "Analyzing design..." while the Vision AI processes
   - The style guide appears when analysis is complete

## 7. Expected Results for Phase 3

At the end of Phase 3, you should have:

- A fully working application that:
  - Captures screenshots of websites (Step 1)
  - Shows the screenshot to the user immediately
  - Analyzes them with Vision AI in a separate API call (Step 2)
  - Generates detailed design style guides
  - Presents the results in a clean, user-friendly interface
- The ability to copy style guides to clipboard
- The ability to download screenshots
- Enhanced loading states that show which stage is being processed
- Robust error handling that allows partial results (screenshot without style guide)

## 8. Benefits of the Two-Step Approach

1. **Avoids Timeout Issues**: By splitting the process into two API calls, you avoid Vercel's 10-second timeout limitation.

2. **Better User Experience**: Users see the screenshot immediately, providing feedback that progress is being made.

3. **Partial Results**: If the Vision AI analysis fails, users still get the screenshot.

4. **Easier Debugging**: Errors in either step can be identified and handled separately.

5. **More Efficient Resource Usage**: The screenshot API returns quickly, and the longer-running analysis job runs separately.

## 9. Troubleshooting Phase 3

- **Screenshot API Issues**:
  - Verify your ScreenshotOne API key is correct
  - Check if the URL is properly formatted and accessible
  - Look for CORS issues in the browser console

- **Vision AI Issues**:
  - Ensure your OpenAI API key has access to GPT-4 Vision
  - Check if the screenshot URL is accessible to OpenAI (must be publicly accessible)
  - Monitor for rate limiting or quota issues

- **Vercel Deployment Issues**:
  - Ensure environment variables are set in the Vercel dashboard
  - Verify the `vercel.json` file is properly configured
  - Check function logs in the Vercel dashboard for timeout errors

## 10. Next Steps

After completing Phase 3, consider these enhancements for future phases:

- Add history to save previous analyses
- Implement export options for style guides (JSON, CSS variables, etc.)
- Add user settings for customizing the AI prompt
- Create a comparison feature for multiple websites