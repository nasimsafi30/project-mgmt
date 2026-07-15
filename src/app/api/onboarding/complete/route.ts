import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Save onboarding completion data
    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      data: body,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 });
  }
}
