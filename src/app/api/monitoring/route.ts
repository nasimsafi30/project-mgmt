import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const metrics = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
    cpu: process.cpuUsage(),
    environment: process.env.NODE_ENV || 'development',
  };
  
  return NextResponse.json(metrics);
}
