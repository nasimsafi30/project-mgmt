import { NextRequest, NextResponse } from 'next/server';

const metricsStore: any[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  
  return NextResponse.json({
    metrics: metricsStore.slice(-limit),
    total: metricsStore.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const metric = { ...body, timestamp: Date.now() };
    metricsStore.push(metric);
    
    if (metricsStore.length > 1000) {
      metricsStore.splice(0, metricsStore.length - 1000);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record metric' }, { status: 500 });
  }
}
