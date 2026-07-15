import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emails, teamId, role } = body;
    
    const invited = (emails || []).map((email: string) => ({
      email,
      status: 'invited',
      invitedAt: new Date().toISOString(),
    }));
    
    return NextResponse.json({
      success: true,
      invited,
      message: `${invited.length} user(s) invited successfully`,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to invite users' }, { status: 500 });
  }
}
