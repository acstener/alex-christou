import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('🚀 API Request started:', new Date().toISOString());
  
  try {
    const body = await request.json();
    console.log('📨 Request body:', body);

    const { email } = body;

    if (!email) {
      console.log('❌ Email missing in request');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY?.trim();
    const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID?.trim();

    console.log('🔑 Using API Key:', BEEHIIV_API_KEY?.substring(0, 10) + '...');
    console.log('📖 Publication ID:', BEEHIIV_PUBLICATION_ID);

    if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
      console.log('❌ Missing API configuration');
      return NextResponse.json(
        { error: 'Missing API configuration' },
        { status: 500 }
      );
    }

    console.log('📡 Making request to Beehiiv API...');
    
    const apiUrl = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`;
    console.log('🔗 API URL:', apiUrl);

    const requestBody = {
      email,
      send_welcome_email: true,
      utm_parameters: {
        source: 'personal-website',
        medium: 'organic',
        campaign: 'newsletter-signup'
      }
    };

    console.log('📦 Request body:', requestBody);
    console.log('🔐 Authorization Header:', `Bearer ${BEEHIIV_API_KEY.substring(0, 5)}...`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`
      },
      body: JSON.stringify(requestBody),
    });

    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('📬 Beehiiv API response:', data);

    if (!response.ok) {
      console.log('❌ Beehiiv API error:', data);
      return NextResponse.json(
        { error: data.error || 'Failed to subscribe' },
        { status: response.status }
      );
    }

    console.log('✅ Subscription initiated!');
    
    return NextResponse.json(
      { message: 'Thanks! Please check your email to confirm your subscription.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
