import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ stats: { users: 0, teams: 0, projects: 0, tasks: 0 }, taskStatuses: [] });
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json({ success: true });
}
