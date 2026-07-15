import { NextRequest, NextResponse } from 'next/server';

let notifications: any[] = [
  { id: '1', title: 'Task Assigned', message: 'You have been assigned to "Design Homepage"', type: 'info', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', title: 'Comment Added', message: 'Jane commented on "API Integration"', type: 'info', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', title: 'Deadline Approaching', message: '"Testing Suite" is due in 2 days', type: 'warning', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unread') === 'true';
  const filtered = unreadOnly ? notifications.filter(n => !n.read) : notifications;
  return NextResponse.json({ notifications: filtered, unreadCount: notifications.filter(n => !n.read).length });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.readAll) { notifications = notifications.map(n => ({ ...n, read: true })); return NextResponse.json({ success: true }); }
    if (body.id) { notifications = notifications.map(n => n.id === body.id ? { ...n, read: true } : n); return NextResponse.json({ success: true }); }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
