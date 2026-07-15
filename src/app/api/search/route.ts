import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks, projects, teams } from '@/db/schema';
import { or, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    if (!query || query.length < 2) return NextResponse.json({ results: [] });
    const searchTerm = `%${query}%`;
    const results: any[] = [];
    const taskResults = await db.select().from(tasks).where(or(like(tasks.title, searchTerm), like(tasks.description || '', searchTerm))).limit(5);
    results.push(...taskResults.map((t: any) => ({ ...t, resultType: 'task' })));
    const projectResults = await db.select().from(projects).where(or(like(projects.name, searchTerm), like(projects.description || '', searchTerm))).limit(3);
    results.push(...projectResults.map((p: any) => ({ ...p, resultType: 'project' })));
    const teamResults = await db.select().from(teams).where(like(teams.name, searchTerm)).limit(3);
    results.push(...teamResults.map((t: any) => ({ ...t, resultType: 'team' })));
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

