import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      entry: {
        id: crypto.randomUUID(),
        ...body,
        startTime: new Date().toISOString(),
        status: 'running',
      },
      message: 'Timer started',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to start timer' }, { status: 500 });
  }
}
