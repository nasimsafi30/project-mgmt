import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pluginId } = body;
    
    return NextResponse.json({
      success: true,
      pluginId,
      message: 'Plugin installed successfully',
      installedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to install plugin' }, { status: 500 });
  }
}
