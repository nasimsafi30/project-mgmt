import { NextRequest, NextResponse } from 'next/server';

const installedPlugins: any[] = [
  { id: 'github-sync', name: 'GitHub Sync', version: '2.1.0', enabled: true, installedAt: new Date().toISOString() },
];

export async function GET() {
  return NextResponse.json({ plugins: installedPlugins, total: installedPlugins.length });
}
