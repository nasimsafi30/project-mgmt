import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, teamMembers, users, activityLogs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/projects/[id]/members
 * Get project members (inherited from team)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, params.id))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get team members
    const members = await db
      .select({
        member: teamMembers,
        user: users,
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, project.teamId));

    return NextResponse.json({
      data: members.map((m: any) => ({
        ...m.user,
        role: m.member.role,
        joinedAt: m.member.joinedAt,
      })),
      total: members.length,
    });
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

/**
 * POST /api/projects/[id]/members
 * Add a member to the project's team
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, role = 'member' } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, params.id))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Add to team
    const [newMember] = await db.insert(teamMembers).values({
      teamId: project.teamId,
      userId,
      role,
    }).returning();

    await db.insert(activityLogs).values({
      action: 'member_added',
      entityType: 'project',
      entityId: params.id,
      userId: body.addedBy || 'system',
      metadata: { userId, role },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Failed to add member:', error);
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}
