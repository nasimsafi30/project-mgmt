import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { teams, teamMembers, users, activityLogs } from '@/db/schema';
import { eq, and, count, or, like } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    let query = db.select({ member: teamMembers, user: users })
      .from(teamMembers).innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, params.id)).$dynamic();

    if (role) query = query.where(eq(teamMembers.role, role as any));
    if (search) query = query.where(or(like(users.name, `%${search}%`), like(users.email, `%${search}%`)));

    const members = await query;

    return NextResponse.json({
      data: members.map((m: any) => ({ id: m.user.id, name: m.user.name, email: m.user.email, avatarUrl: m.user.avatarUrl, role: m.member.role, joinedAt: m.member.joinedAt })),
      total: members.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { userId, role = 'member' } = body;
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const [existing] = await db.select().from(teamMembers).where(and(eq(teamMembers.teamId, params.id), eq(teamMembers.userId, userId))).limit(1);
    if (existing) return NextResponse.json({ error: 'Already a member' }, { status: 409 });

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const [newMember] = await db.insert(teamMembers).values({ teamId: params.id, userId, role: role as any }).returning();

    await db.insert(activityLogs).values({ action: 'member_added', entityType: 'team', entityId: params.id, userId: 'system', metadata: { userId, role } });

    return NextResponse.json({ ...newMember, user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { userId, role } = body;
    if (!userId || !role) return NextResponse.json({ error: 'userId and role required' }, { status: 400 });

    const [updated] = await db.update(teamMembers).set({ role: role as any })
      .where(and(eq(teamMembers.teamId, params.id), eq(teamMembers.userId, userId))).returning();

    if (!updated) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

    await db.insert(activityLogs).values({ action: 'member_role_changed', entityType: 'team', entityId: params.id, userId: 'system', metadata: { userId, newRole: role } });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const [member] = await db.select().from(teamMembers).where(and(eq(teamMembers.teamId, params.id), eq(teamMembers.userId, userId))).limit(1);
    if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

    if (member.role === 'owner') {
      const [ownerCount] = await db.select({ count: count() }).from(teamMembers).where(and(eq(teamMembers.teamId, params.id), eq(teamMembers.role, 'owner')));
      if ((ownerCount?.count || 0) <= 1) return NextResponse.json({ error: 'Cannot remove last owner' }, { status: 400 });
    }

    const [deleted] = await db.delete(teamMembers).where(and(eq(teamMembers.teamId, params.id), eq(teamMembers.userId, userId))).returning();

    await db.insert(activityLogs).values({ action: 'member_removed', entityType: 'team', entityId: params.id, userId: 'system', metadata: { userId } });

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}
