import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { url } = await request.json();
  
  // Validate URL
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  
  try {
    // Call ScreenshotOne API with your access key
    const accessKey = process.env.SCREENSHOT_API_KEY;
    
    // Debug: Log the access key (first few characters for security)
    console.log('Using access key:', accessKey ? `${accessKey.substring(0, 4)}...` : 'undefined');
    
    if (!accessKey) {
      console.error('SCREENSHOT_API_KEY is not defined in environment variables');
      return NextResponse.json(
        { error: 'API key configuration error' }, 
        { status: 500 }
      );
    }
    
    // Construct the API URL according to documentation
    // Instead of using response_type=json, let's directly get the image
    const screenshotUrl = new URL('https://api.screenshotone.com/take');
    
    // Add query parameters as per the ScreenshotOne documentation
    screenshotUrl.searchParams.append('access_key', accessKey);
    screenshotUrl.searchParams.append('url', url);
    screenshotUrl.searchParams.append('format', 'jpg');
    screenshotUrl.searchParams.append('viewport_width', '1280');
    screenshotUrl.searchParams.append('viewport_height', '800');
    // Removed response_type=json to get direct image
    
    console.log('Requesting screenshot from:', screenshotUrl.toString());
    
    // First, check if the API key is valid by making a test request
    const testResponse = await fetch(`https://api.screenshotone.com/usage?access_key=${accessKey}`, {
      method: 'GET',
      headers: {
        'X-Access-Key': accessKey,
      },
    });
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('API key validation failed:', errorText);
      return NextResponse.json(
        { error: 'Invalid API key or API access issue', details: errorText }, 
        { status: 500 }
      );
    }
    
    // The API key is valid, now get the screenshot
    // For direct image URL, we'll just return the URL to the API
    // The browser will make the request directly
    const directImageUrl = screenshotUrl.toString();
    
    // Return the screenshot URL
    return NextResponse.json({
      success: true,
      screenshot: directImageUrl,
      metadata: {
        url: url,
        capturedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing screenshot request:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
} 