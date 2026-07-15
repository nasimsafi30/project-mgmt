import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Return integration details
    return NextResponse.json({
      id: params.id,
      name: 'Integration',
      status: 'disconnected',
      config: {},
    });
  } catch (error) {
    return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
  }
}
