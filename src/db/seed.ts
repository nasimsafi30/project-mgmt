import { db } from './index';
import { teams, teamMembers, projects, tasks, users } from './schema';

async function seed() {
  console.log('🌱 Seeding database...\n');

  // Create Users
  console.log('Creating users...');
  const [user1] = await db.insert(users).values({
    clerkId: 'user_1',
    email: 'john@example.com',
    name: 'John Doe',
  }).returning();

  const [user2] = await db.insert(users).values({
    clerkId: 'user_2',
    email: 'jane@example.com',
    name: 'Jane Smith',
  }).returning();

  console.log(`  ✓ Created 2 users`);

  // Create Teams
  console.log('Creating teams...');
  const [team1] = await db.insert(teams).values({
    name: 'Engineering Team',
    description: 'Core engineering team',
  }).returning();

  const [team2] = await db.insert(teams).values({
    name: 'Design Team',
    description: 'UI/UX design team',
  }).returning();

  console.log(`  ✓ Created 2 teams`);

  // Create Team Members
  console.log('Creating team members...');
  await db.insert(teamMembers).values([
    { teamId: team1.id, userId: user1.id, role: 'owner' },
    { teamId: team1.id, userId: user2.id, role: 'member' },
    { teamId: team2.id, userId: user2.id, role: 'owner' },
  ]);

  console.log(`  ✓ Created team memberships`);

  // Create Projects
  console.log('Creating projects...');
  const [project1] = await db.insert(projects).values({
    name: 'Website Redesign',
    description: 'Complete website overhaul',
    teamId: team1.id,
  }).returning();

  const [project2] = await db.insert(projects).values({
    name: 'Mobile App',
    description: 'iOS and Android development',
    teamId: team1.id,
  }).returning();

  console.log(`  ✓ Created 2 projects`);

  // Create Tasks
  console.log('Creating tasks...');
  const taskList = [
    { title: 'Design new homepage', description: 'Modern responsive design', status: 'in_progress' as const, priority: 'high' as const, assigneeId: user1.id },
    { title: 'Setup CI/CD', description: 'Automated deployment', status: 'todo' as const, priority: 'medium' as const, assigneeId: user2.id },
    { title: 'Write API docs', description: 'Document all endpoints', status: 'backlog' as const, priority: 'low' as const, assigneeId: null },
    { title: 'Fix login bug', description: 'SSO not working', status: 'in_review' as const, priority: 'urgent' as const, assigneeId: user1.id },
    { title: 'Add dark mode', description: 'Theme switcher', status: 'done' as const, priority: 'medium' as const, assigneeId: user2.id },
    { title: 'Optimize queries', description: 'Improve performance', status: 'in_progress' as const, priority: 'high' as const, assigneeId: user1.id },
    { title: 'Create onboarding', description: 'User onboarding flow', status: 'todo' as const, priority: 'medium' as const, assigneeId: user2.id },
    { title: 'Update dependencies', description: 'Latest versions', status: 'backlog' as const, priority: 'low' as const, assigneeId: null },
  ];

  for (const t of taskList) {
    await db.insert(tasks).values({
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      projectId: project1.id,
      assigneeId: t.assigneeId,
      creatorId: user1.id,
      position: taskList.indexOf(t),
    });
  }

  console.log(`  ✓ Created ${taskList.length} tasks`);

  console.log('\n✅ Seed completed!\n');
}

seed().catch(console.error).finally(() => process.exit(0));
