import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { imageUrl } = await request.json();
  
  // Validate image URL
  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  }
  
  try {
    // Log the received image URL for debugging
    console.log('Design Feedback API received image URL:', imageUrl);
    
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

    // Your custom prompt for design feedback
    const promptTemplate = `You are an expert UI designer who provides thoughtful, specific feedback following the design principles from Refactoring UI by Adam Wathan and Steve Schoger.

When analyzing this design, please provide detailed feedback organized in these numbered sections:

### 1. Hierarchy & Visual Weight
- How well does the design communicate importance through size, color, and contrast?
- Are primary actions clearly emphasized?
- Is secondary information appropriately de-emphasized?

### 2. Layout & Spacing
- Is there enough white space around elements?
- Are there spacing inconsistencies that need addressing?
- Do related elements have appropriate proximity?
- Are there areas that feel too crowded or too empty?

### 3. Typography
- Is the text hierarchy clear and effective?
- Are font sizes appropriate and consistent?
- Is line height and letter spacing optimized for readability?
- Could font weights be used more effectively?

### 4. Color Usage
- Are colors used consistently and purposefully?
- Is there appropriate contrast for readability?
- Are accent colors drawing attention to the right elements?
- Could colors be used more effectively to create hierarchy?

### 5. Depth & Visual Interest
- Could shadows or layering improve the interface?
- Are backgrounds utilized effectively?
- Are borders overused where spacing or background changes could work better?

### 6. Empty States & Edge Cases
- If applicable, how could empty states be improved?
- Are there potential edge cases not accounted for?

### 7. Most Impactful Changes
List the 3-5 highest-impact changes that would significantly improve this design. Focus on changes that would have the biggest visual and usability impact with the least effort.

Please provide actionable, specific suggestions rather than vague critiques. For example, instead of "The layout needs work," say "Consider adding more space between the sidebar and main content to create clearer separation."

Don't suggest code changes or specific pixel values - focus on visual design principles that I can implement myself.`;
    
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
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: promptTemplate },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });
    
    if (!visionResponse.ok) {
      const errorData = await visionResponse.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to analyze design' }, 
        { status: 500 }
      );
    }

    const visionData = await visionResponse.json();
    const feedback = visionData.choices[0].message.content;
    
    // Debug the response
    console.log('OpenAI Response:', {
      feedbackLength: feedback.length,
      feedbackPreview: feedback.substring(0, 200),
      hasMostImpactful: feedback.includes('Most Impactful Changes'),
      sections: feedback.match(/###\s+\d+\./g)
    });

    // Ensure the response includes all sections
    if (!feedback.includes('### 7. Most Impactful Changes')) {
      const enhancedPrompt = `${promptTemplate}\n\nIMPORTANT: Please make sure to include the "Most Impactful Changes" section in your response, listing 3-5 highest-impact changes.`;
      
      // Make a second attempt with enhanced prompt
      const secondResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: enhancedPrompt },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl,
                    detail: "high"
                  }
                }
              ]
            }
          ],
          max_tokens: 4096,
          temperature: 0.7
        })
      });

      if (secondResponse.ok) {
        const secondData = await secondResponse.json();
        const secondFeedback = secondData.choices[0].message.content;
        
        // Use the second response if it includes the missing section
        if (secondFeedback.includes('### 7. Most Impactful Changes')) {
          console.log('Successfully retrieved missing section in second attempt');
          return NextResponse.json({
            success: true,
            feedback: secondFeedback
          });
        }
      }
    }
    
    // Return the design feedback
    return NextResponse.json({
      success: true,
      feedback: feedback
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
} 