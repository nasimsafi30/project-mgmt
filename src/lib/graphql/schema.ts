import { builder } from './builder';
import { db } from '@/db';
import { tasks, projects, users, teams, comments, attachments, activityLogs } from '@/db/schema';
import { eq, desc, and, or, like, count, inArray } from 'drizzle-orm';

// ============================================
// Enums
// ============================================
const TaskStatus = builder.enumType('TaskStatus', {
  values: ['backlog', 'todo', 'in_progress', 'in_review', 'done'] as const,
});

const TaskPriority = builder.enumType('TaskPriority', {
  values: ['low', 'medium', 'high', 'urgent'] as const,
});

// ============================================
// Types
// ============================================
const UserType = builder.objectRef<any>('User').implement({
  fields: (t: any) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    avatarUrl: t.exposeString('avatarUrl', { nullable: true }),
    createdAt: t.exposeString('createdAt'),
  }),
});

const ProjectType = builder.objectRef<any>('Project').implement({
  fields: (t: any) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    createdAt: t.exposeString('createdAt'),
    updatedAt: t.exposeString('updatedAt'),
  }),
});

const CommentType = builder.objectRef<any>('Comment').implement({
  fields: (t: any) => ({
    id: t.exposeID('id'),
    content: t.exposeString('content'),
    taskId: t.exposeString('taskId'),
    createdAt: t.exposeString('createdAt'),
  }),
});

const TaskType = builder.objectRef<any>('Task').implement({
  fields: (t: any) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    description: t.exposeString('description', { nullable: true }),
    status: t.field({ type: TaskStatus, resolve: (task: any) => task.status }),
    priority: t.field({ type: TaskPriority, resolve: (task: any) => task.priority }),
    project: t.field({
      type: ProjectType,
      resolve: (task: any) => db.select().from(projects).where(eq(projects.id, task.projectId)).limit(1).then((r: any) => r[0]),
    }),
    assignee: t.field({
      type: UserType,
      nullable: true,
      resolve: (task: any) => task.assigneeId ? db.select().from(users).where(eq(users.id, task.assigneeId)).limit(1).then((r: any) => r[0]) : null,
    }),
    comments: t.field({
      type: [CommentType],
      resolve: (task: any) => db.select().from(comments).where(eq(comments.taskId, task.id)),
    }),
    dueDate: t.exposeString('dueDate', { nullable: true }),
    createdAt: t.exposeString('createdAt'),
    updatedAt: t.exposeString('updatedAt'),
  }),
});

// ============================================
// Queries
// ============================================
builder.queryType({
  fields: (t: any) => ({
    tasks: t.field({
      type: [TaskType],
      args: {
        projectId: t.arg.string(),
        status: t.arg({ type: TaskStatus }),
        search: t.arg.string(),
        limit: t.arg.int({ defaultValue: 50 }),
      },
      resolve: async (_: any, args: any) => {
        let query: any = db.select().from(tasks).$dynamic();
        if (args.projectId) query = query.where(eq(tasks.projectId, args.projectId));
        if (args.status) query = query.where(eq(tasks.status, args.status));
        if (args.search) query = query.where(or(like(tasks.title, `%${args.search}%`), like(tasks.description || '', `%${args.search}%`)));
        return query.orderBy(desc(tasks.updatedAt)).limit(args.limit);
      },
    }),

    task: t.field({
      type: TaskType,
      args: { id: t.arg.string({ required: true }) },
      resolve: (_: any, args: any) => db.select().from(tasks).where(eq(tasks.id, args.id)).limit(1).then((r: any) => r[0] || null),
    }),

    projects: t.field({
      type: [ProjectType],
      resolve: () => db.select().from(projects).orderBy(desc(projects.updatedAt)).limit(20),
    }),

    users: t.field({
      type: [UserType],
      resolve: () => db.select().from(users).limit(50),
    }),

    search: t.field({
      type: [TaskType],
      args: { query: t.arg.string({ required: true }), limit: t.arg.int({ defaultValue: 10 }) },
      resolve: async (_: any, args: any) => {
        const q = `%${args.query}%`;
        return db.select().from(tasks).where(or(like(tasks.title, q), like(tasks.description || '', q))).limit(args.limit);
      },
    }),
  }),
});

// ============================================
// Mutations
// ============================================
builder.mutationType({
  fields: (t: any) => ({
    createTask: t.field({
      type: TaskType,
      args: {
        title: t.arg.string({ required: true }),
        description: t.arg.string(),
        status: t.arg({ type: TaskStatus }),
        priority: t.arg({ type: TaskPriority }),
        projectId: t.arg.string({ required: true }),
        assigneeId: t.arg.string(),
        dueDate: t.arg.string(),
      },
      resolve: async (_: any, args: any) => {
        const [newTask] = await db.insert(tasks).values({
          title: args.title,
          description: args.description || null,
          status: args.status || 'backlog',
          priority: args.priority || 'medium',
          projectId: args.projectId,
          assigneeId: args.assigneeId || null,
          creatorId: '00000000-0000-0000-0000-000000000001',
          dueDate: args.dueDate ? new Date(args.dueDate) : null,
          position: 0,
        }).returning();
        return newTask;
      },
    }),

    updateTask: t.field({
      type: TaskType,
      args: {
        id: t.arg.string({ required: true }),
        title: t.arg.string(),
        status: t.arg({ type: TaskStatus }),
        priority: t.arg({ type: TaskPriority }),
      },
      resolve: async (_: any, args: any) => {
        const { id, ...updates } = args;
        const [updated] = await db.update(tasks).set({ ...updates, updatedAt: new Date() }).where(eq(tasks.id, id)).returning();
        return updated;
      },
    }),

    deleteTask: t.field({
      type: 'Boolean',
      args: { id: t.arg.string({ required: true }) },
      resolve: async (_: any, args: any) => {
        await db.delete(tasks).where(eq(tasks.id, args.id));
        return true;
      },
    }),
  }),
});

export const schema = builder.toSchema();
