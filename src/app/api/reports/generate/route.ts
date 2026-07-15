import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, config } = body;
    
    const report = {
      id: crypto.randomUUID(),
      type,
      config,
      generatedAt: new Date().toISOString(),
      status: 'completed',
      data: {
        summary: 'Report generated successfully',
        details: {},
      },
    };
    
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
