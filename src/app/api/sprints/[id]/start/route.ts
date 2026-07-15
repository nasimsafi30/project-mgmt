import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({
    success: true,
    sprintId: params.id,
    status: 'active',
    startedAt: new Date().toISOString(),
    message: 'Sprint started successfully',
  });
}
