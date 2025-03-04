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
    const screenshotUrl = new URL('https://api.screenshotone.com/take');
    
    // Add query parameters as per the ScreenshotOne documentation
    screenshotUrl.searchParams.append('access_key', accessKey);
    screenshotUrl.searchParams.append('url', url);
    screenshotUrl.searchParams.append('format', 'jpg');
    screenshotUrl.searchParams.append('viewport_width', '1280');
    screenshotUrl.searchParams.append('viewport_height', '800');
    // We need the actual image data, not just a URL
    
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
    
    // The API key is valid, now actually fetch the screenshot image
    console.log('Fetching the actual screenshot image...');
    const imageResponse = await fetch(screenshotUrl.toString());
    
    if (!imageResponse.ok) {
      console.error('Failed to fetch screenshot:', imageResponse.status, imageResponse.statusText);
      let errorDetails;
      try {
        errorDetails = await imageResponse.text();
      } catch (e) {
        errorDetails = 'Could not extract error details';
      }
      
      return NextResponse.json(
        { error: 'Failed to capture screenshot', details: errorDetails }, 
        { status: 500 }
      );
    }
    
    // Check if we got an image
    const contentType = imageResponse.headers.get('content-type');
    console.log('Screenshot response content type:', contentType);
    
    if (!contentType || !contentType.startsWith('image/')) {
      console.error('ScreenshotOne did not return an image. Content-Type:', contentType);
      let responseText;
      try {
        responseText = await imageResponse.text();
      } catch (e) {
        responseText = 'Could not extract response text';
      }
      
      return NextResponse.json(
        { error: 'Invalid response from screenshot service', details: responseText }, 
        { status: 500 }
      );
    }
    
    // Convert the image to a Base64 string
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:${contentType};base64,${base64Image}`;
    
    console.log('Successfully converted screenshot to Base64 data URL');
    
    // Return the Base64 data URL
    return NextResponse.json({
      success: true,
      screenshot: dataUrl,
      metadata: {
        url: url,
        capturedAt: new Date().toISOString(),
        format: contentType
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