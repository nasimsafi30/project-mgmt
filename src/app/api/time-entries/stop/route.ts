import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entryId } = body;
    
    return NextResponse.json({
      success: true,
      entryId,
      endTime: new Date().toISOString(),
      status: 'stopped',
      message: 'Timer stopped',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to stop timer' }, { status: 500 });
  }
}
