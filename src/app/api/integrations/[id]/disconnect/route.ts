import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({
      success: true,
      integration: params.id,
      status: 'disconnected',
      message: `Successfully disconnected from ${params.id}`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to disconnect integration' }, { status: 500 });
  }
}
