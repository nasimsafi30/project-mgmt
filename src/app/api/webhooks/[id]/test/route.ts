import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Simulate sending test payload
    const testPayload = {
      id: crypto.randomUUID(),
      event: 'test',
      timestamp: new Date().toISOString(),
      data: { message: 'This is a test webhook payload' },
    };
    
    return NextResponse.json({
      success: true,
      webhookId: params.id,
      payload: testPayload,
      message: 'Test webhook sent successfully',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send test webhook' }, { status: 500 });
  }
}
