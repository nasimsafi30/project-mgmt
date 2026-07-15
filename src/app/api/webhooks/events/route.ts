import { NextRequest, NextResponse } from 'next/server';

const availableEvents = [
  { event: 'task.created', description: 'When a new task is created' },
  { event: 'task.updated', description: 'When a task is updated' },
  { event: 'task.deleted', description: 'When a task is deleted' },
  { event: 'task.moved', description: 'When a task is moved to a different column' },
  { event: 'task.completed', description: 'When a task is marked as completed' },
  { event: 'task.assigned', description: 'When a task is assigned to a user' },
  { event: 'comment.added', description: 'When a comment is added to a task' },
  { event: 'sprint.started', description: 'When a sprint is started' },
  { event: 'sprint.completed', description: 'When a sprint is completed' },
  { event: 'member.joined', description: 'When a member joins a team' },
  { event: 'member.removed', description: 'When a member is removed from a team' },
  { event: 'project.created', description: 'When a new project is created' },
  { event: 'time.entry.created', description: 'When a time entry is logged' },
];

export async function GET() {
  return NextResponse.json({ events: availableEvents });
}
