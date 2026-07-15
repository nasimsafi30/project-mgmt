import { NextRequest, NextResponse } from 'next/server';

const scheduledReports: any[] = [
  { id: '1', name: 'Weekly Progress Report', type: 'progress', schedule: 'weekly', day: 'Monday', recipients: ['team@example.com'], enabled: true },
  { id: '2', name: 'Monthly Analytics', type: 'analytics', schedule: 'monthly', day: '1', recipients: ['admin@example.com'], enabled: true },
];

export async function GET() {
  return NextResponse.json({ reports: scheduledReports });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newReport = { id: crypto.randomUUID(), ...body, enabled: true };
    scheduledReports.push(newReport);
    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to schedule report' }, { status: 500 });
  }
}
