import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const health = {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch system info' }, { status: 500 });
  }
}
