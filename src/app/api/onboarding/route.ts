import { NextRequest, NextResponse } from 'next/server';

const onboardingSteps = [
  { id: 'welcome', title: 'Welcome', completed: false },
  { id: 'profile', title: 'Profile Setup', completed: false },
  { id: 'project', title: 'Create Project', completed: false },
  { id: 'invite', title: 'Invite Team', completed: false },
  { id: 'complete', title: 'Complete', completed: false },
];

export async function GET() {
  return NextResponse.json({ steps: onboardingSteps, progress: 0 });
}
