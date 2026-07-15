import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    completed: false,
    currentStep: 'welcome',
    progress: 20,
    steps: [
      { id: 'welcome', completed: true },
      { id: 'profile', completed: false },
      { id: 'project', completed: false },
      { id: 'invite', completed: false },
    ],
  });
}
