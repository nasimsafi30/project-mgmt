import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({
    userId: params.id,
    settings: {
      theme: 'light',
      notifications: { email: true, push: true, desktop: false },
      language: 'en',
      timezone: 'UTC',
    },
  });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, userId: params.id, settings: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
