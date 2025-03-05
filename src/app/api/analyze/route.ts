import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { imageUrl } = await request.json();
  
  // Validate image URL
  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  }
  
  try {
    // Log the received image URL for debugging
    console.log('Analyze API received image URL:', imageUrl);
    
    // Validate the image URL is accessible
    try {
      console.log('Checking if image URL is accessible...');
      const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
      console.log('Image URL accessibility check result:', {
        status: imageResponse.status,
        ok: imageResponse.ok,
        contentType: imageResponse.headers.get('content-type')
      });
      
      if (!imageResponse.ok) {
        console.error('Image URL is not accessible:', imageResponse.status, imageResponse.statusText);
        return NextResponse.json(
          { error: 'Image URL is not accessible. The screenshot might not be ready or publicly available.' }, 
          { status: 400 }
        );
      }
      
      // Check if content type is an image
      const contentType = imageResponse.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        console.error('URL does not point to an image. Content-Type:', contentType);
        return NextResponse.json(
          { error: 'URL does not point to an image' }, 
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error checking image URL accessibility:', error);
      return NextResponse.json(
        { error: 'Failed to validate image URL accessibility', details: error instanceof Error ? error.message : String(error) }, 
        { status: 400 }
      );
    }
    
    // Your custom prompt for design style guide extraction
    const promptTemplate = `
      You are a seasoned UI/UX designer with an eye for design patterns and relationships. Analyze this website screenshot and create an inspirational design guide that captures the core visual language and feel of the interface.
      
      Extract and describe these key design elements:

      1. Visual Style & Mood:
         - Core brand colors (3-5 key colors with hex codes)
         - Overall aesthetic direction (minimal, bold, playful, etc.)
         - Visual tone and personality traits

      2. Typography Fundamentals:
         - Primary font families (heading and body)
         - Key type scale relationships (not every size, just the pattern)
         - Font weight usage patterns
         - Standout text treatments and styles

      3. Space & Rhythm:
         - Base spacing unit if identifiable
         - Content padding patterns
         - Component spacing relationships
         - Breathing room principles

      4. Component Patterns:
         - Button styling approach (shape, padding, states)
         - Input field treatment
         - Card/container styling patterns
         - Interactive element behaviors
         - Key component proportions

      5. Visual Treatments:
         - Shadow usage approach
         - Border and corner radius patterns
         - Key visual effects (subtle details that create the feel)
         - Surface treatment patterns

      6. Layout Framework:
         - Main container approach
         - Content width strategy
         - Major breakpoint behavior (mobile vs desktop thinking)
         - Component arrangement principles

      7. Interactive Feel:
         - State changes (hover, active, etc.)
         - Transition characteristics
         - Interactive feedback patterns

      Extract these elements as a practical guide that captures the "vibe" and core design decisions, which can be used as inspiration rather than strict documentation. Include the most important measurements and values, but prioritize the overall patterns and relationships that give the interface its distinctive feel.

      Focus on describing the design system in terms of relationships and patterns rather than exhaustive specifications. Highlight what makes this interface unique and how its various elements work together to create a cohesive experience.
    `;
    
    // Log the request being made to OpenAI for debugging
    console.log('Preparing to send request to OpenAI Vision API with image:', imageUrl);
    
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY is not defined in environment variables');
      return NextResponse.json(
        { error: 'API key configuration error' }, 
        { status: 500 }
      );
    }
    
    // Log the first few characters of the API key to verify it's loaded (safely)
    console.log('OpenAI API key loaded (first 4 chars):', openaiApiKey.substring(0, 4) + '...');
    
    // Prepare the request body
    const requestBody = {
      model: "gpt-4o", // Updated to use gpt-4o which has vision capabilities
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: promptTemplate },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high" // Using high detail for better analysis
              }
            }
          ]
        }
      ],
      max_tokens: 2000
    };
    
    // Log the full request body for debugging
    console.log('Vision API request body:', JSON.stringify(requestBody, null, 2));
    
    // Using the OpenAI API as shown in the documentation
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    // Log the response status and headers
    console.log('Vision API response status:', visionResponse.status);
    console.log('Vision API response headers:', Object.fromEntries([...visionResponse.headers.entries()]));
    
    if (!visionResponse.ok) {
      let errorData;
      try {
        errorData = await visionResponse.json();
        console.error('Vision API error data:', JSON.stringify(errorData, null, 2));
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
      } else if (visionResponse.status === 400) {
        errorMessage = `Bad request to Vision API: ${errorData?.error?.message || 'Unknown error'}`;
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
    console.log('Vision API success response received');
    
    // Log a sample of the response to verify it contains what we expect
    if (visionData.choices && visionData.choices.length > 0) {
      const sampleContent = visionData.choices[0].message.content.substring(0, 100) + '...';
      console.log('Vision API response sample:', sampleContent);
    }
    
    const styleGuide = visionData.choices[0].message.content;
    
    // Return the style guide
    return NextResponse.json({
      success: true,
      styleGuide
    });
  } catch (error) {
    console.error('Unexpected error in analyze API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
} 