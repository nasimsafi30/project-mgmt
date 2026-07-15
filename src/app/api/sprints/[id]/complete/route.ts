import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({
    success: true,
    sprintId: params.id,
    status: 'completed',
    completedAt: new Date().toISOString(),
    message: 'Sprint completed successfully',
  });
}
