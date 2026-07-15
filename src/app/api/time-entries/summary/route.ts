import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'today';
  
  const summary = {
    period,
    totalHours: 8.5,
    billableHours: 6.5,
    nonBillableHours: 2.0,
    totalEntries: 5,
    estimatedRevenue: 975,
    projects: [
      { name: 'Website Redesign', hours: 4.5, percentage: 53 },
      { name: 'Backend', hours: 3.0, percentage: 35 },
      { name: 'Meetings', hours: 1.0, percentage: 12 },
    ],
  };
  
  return NextResponse.json(summary);
}
