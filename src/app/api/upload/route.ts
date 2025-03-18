import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

async function uploadToBunny(buffer: Buffer, fileName: string) {
  const storageZone = process.env.BUNNY_STORAGE_ZONE;
  const accessKey = process.env.BUNNY_ACCESS_KEY;
  const region = process.env.BUNNY_REGION || 'storage';
  
  if (!storageZone || !accessKey) {
    throw new Error('BunnyCDN configuration missing');
  }

  // Base URL for storage API - handle region properly
  const url = `https://${region}.bunnycdn.com/${storageZone}/design-feedback/${fileName}`;
  
  try {
    console.log('Attempting to upload to BunnyCDN:', {
      url: url.replace(accessKey, '***'), // Hide access key in logs
      fileSize: buffer.length,
      storageZone,
      region
    });

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'AccessKey': accessKey,
        'Content-Type': 'application/octet-stream',
        'accept': 'application/json'
      },
      body: buffer
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('BunnyCDN error response:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`Failed to upload to BunnyCDN: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // If upload successful (201 status), return the CDN URL
    return `https://${storageZone}.b-cdn.net/design-feedback/${fileName}`;
  } catch (error) {
    console.error('BunnyCDN upload error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Get file extension and generate unique name
    const ext = file.type.split('/')[1];
    const fileName = `${uuidv4()}.${ext}`;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to BunnyCDN
    const cdnUrl = await uploadToBunny(buffer, fileName);
    
    return NextResponse.json({
      success: true,
      url: cdnUrl,
      metadata: {
        fileName: `design-feedback/${fileName}`,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process file upload', 
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 