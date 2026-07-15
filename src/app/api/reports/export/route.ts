import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, reportId } = body;
    
    return NextResponse.json({
      success: true,
      format,
      reportId,
      downloadUrl: `/api/reports/download/${reportId}.${format}`,
      message: `Report exported as ${format.toUpperCase()}`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export report' }, { status: 500 });
  }
}
