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