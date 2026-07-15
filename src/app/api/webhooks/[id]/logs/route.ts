import { NextRequest, NextResponse } from 'next/server';

const webhookLogs: any[] = [
  { id: '1', webhookId: '1', event: 'task.created', status: 'success', statusCode: 200, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', webhookId: '1', event: 'task.completed', status: 'success', statusCode: 200, timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', webhookId: '2', event: 'task.moved', status: 'failed', statusCode: 500, timestamp: new Date(Date.now() - 10800000).toISOString() },
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const logs = webhookLogs.filter(l => l.webhookId === params.id);
  return NextResponse.json({ webhookId: params.id, logs, total: logs.length });
}
