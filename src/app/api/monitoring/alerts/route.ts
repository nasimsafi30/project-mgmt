import { NextRequest, NextResponse } from 'next/server';

const alerts: any[] = [
  { id: '1', type: 'warning', message: 'High CPU usage detected', timestamp: new Date(Date.now() - 3600000).toISOString(), acknowledged: false },
  { id: '2', type: 'info', message: 'Backup completed successfully', timestamp: new Date(Date.now() - 7200000).toISOString(), acknowledged: true },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unacknowledged = searchParams.get('unacknowledged') === 'true';
  
  const filtered = unacknowledged ? alerts.filter(a => !a.acknowledged) : alerts;
  return NextResponse.json({ alerts: filtered, total: filtered.length });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.id) {
      const alert = alerts.find(a => a.id === body.id);
      if (alert) alert.acknowledged = true;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
  }
}
