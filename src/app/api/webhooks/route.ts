import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

let webhooks: any[] = [
  { id: '1', name: 'Slack Notifications', url: 'https://hooks.slack.com/services/xxx', events: ['task.created', 'task.completed'], active: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'CI/CD Trigger', url: 'https://ci.example.com/webhook', events: ['task.moved'], active: true, secret: 'whsec_xxx', createdAt: new Date().toISOString() },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({ webhooks, total: webhooks.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.url || !body.events?.length) {
      return NextResponse.json({ error: 'URL and events are required' }, { status: 400 });
    }
    
    const newWebhook = {
      id: crypto.randomUUID(),
      ...body,
      secret: `whsec_${crypto.randomBytes(16).toString('hex')}`,
      active: true,
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      failureCount: 0,
    };
    
    webhooks.push(newWebhook);
    return NextResponse.json(newWebhook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 });
  }
}
