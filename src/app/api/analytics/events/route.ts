import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, properties } = body;
    
    // Track analytics event
    console.log('Analytics Event:', event, properties);
    
    return NextResponse.json({ success: true, event });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
