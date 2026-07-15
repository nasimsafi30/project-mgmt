import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
  boolean,
  pgEnum,
  decimal,
  uniqueIndex,
  index,
  primaryKey,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// ============================================
// Enums
// ============================================
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent']);
export const statusEnum = pgEnum('status', ['backlog', 'todo', 'in_progress', 'in_review', 'done']);
export const projectStatusEnum = pgEnum('project_status', ['active', 'archived', 'deleted']);
export const memberRoleEnum = pgEnum('member_role', ['owner', 'admin', 'member', 'viewer']);
export const sprintStatusEnum = pgEnum('sprint_status', ['planning', 'active', 'completed', 'cancelled']);
export const integrationTypeEnum = pgEnum('integration_type', ['github', 'slack', 'figma', 'gitlab', 'discord', 'jira', 'notion', 'google_drive']);
export const webhookEventEnum = pgEnum('webhook_event', [
  'task.created', 'task.updated', 'task.deleted', 'task.moved', 'task.completed', 'task.assigned',
  'comment.added', 'comment.updated', 'comment.deleted',
  'sprint.started', 'sprint.completed', 'sprint.cancelled',
  'member.joined', 'member.removed', 'member.role_changed',
  'project.created', 'project.updated', 'project.archived', 'project.restored',
  'time.entry.created', 'time.entry.updated', 'time.entry.deleted',
]);

// ============================================
// Users Table
// ============================================
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  role: text('role').default('member'),
  title: text('title'),
  department: text('department'),
  phone: text('phone'),
  timezone: text('timezone').default('UTC'),
  language: text('language').default('en'),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  settings: jsonb('settings').default({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      desktop: false,
    },
  }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  clerkIdIdx: index('users_clerk_id_idx').on(table.clerkId),
}));

// ============================================
// Teams Table
// ============================================
export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  description: text('description'),
  avatarUrl: text('avatar_url'),
  color: text('color').default('#3B82F6'),
  icon: text('icon').default('users'),
  maxMembers: integer('max_members'),
  isDefault: boolean('is_default').default(false),
  settings: jsonb('settings').default({}),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================
// Team Members Table
// ============================================
export const teamMembers = pgTable('team_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: memberRoleEnum('role').default('member'),
  joinedAt: timestamp('joined_at').defaultNow(),
  invitedBy: uuid('invited_by').references(() => users.id),
}, (table) => ({
  teamUserIdx: uniqueIndex('team_members_team_user_idx').on(table.teamId, table.userId),
}));

// ============================================
// Projects Table
// ============================================
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug'),
  description: text('description'),
  teamId: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
  status: projectStatusEnum('status').default('active'),
  visibility: text('visibility').default('private'),
  color: text('color').default('#3B82F6'),
  icon: text('icon').default('folder'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  archivedAt: timestamp('archived_at'),
  restoredAt: timestamp('restored_at'),
  settings: jsonb('settings').default({
    defaultView: 'kanban',
    allowComments: true,
    autoAssign: false,
    notifyOnChanges: true,
  }),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  teamIdx: index('projects_team_idx').on(table.teamId),
  statusIdx: index('projects_status_idx').on(table.status),
}));

// ============================================
// Tasks Table
// ============================================
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: statusEnum('status').default('backlog'),
  priority: priorityEnum('priority').default('medium'),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  assigneeId: uuid('assignee_id').references(() => users.id),
  creatorId: uuid('creator_id').references(() => users.id).notNull(),
  parentTaskId: uuid('parent_task_id').references((): any => tasks.id),
  sprintId: uuid('sprint_id').references((): any => sprints.id),
  dueDate: timestamp('due_date'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  position: integer('position').default(0),
  storyPoints: integer('story_points'),
  labels: jsonb('labels').default([]),
  estimatedHours: decimal('estimated_hours'),
  actualHours: decimal('actual_hours'),
  attachments: jsonb('attachments').default([]),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  projectIdx: index('tasks_project_idx').on(table.projectId),
  statusIdx: index('tasks_status_idx').on(table.status),
  assigneeIdx: index('tasks_assignee_idx').on(table.assigneeId),
  sprintIdx: index('tasks_sprint_idx').on(table.sprintId),
  dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
}));

// ============================================
// Sprints Table
// ============================================
export const sprints = pgTable('sprints', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  goal: text('goal'),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  status: sprintStatusEnum('status').default('planning'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  totalPoints: integer('total_points').default(0),
  completedPoints: integer('completed_points').default(0),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  projectIdx: index('sprints_project_idx').on(table.projectId),
}));

// ============================================
// Comments Table
// ============================================
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }).notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  parentCommentId: uuid('parent_comment_id').references((): any => comments.id),
  isEdited: boolean('is_edited').default(false),
  mentions: jsonb('mentions').default([]),
  reactions: jsonb('reactions').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  taskIdx: index('comments_task_idx').on(table.taskId),
  authorIdx: index('comments_author_idx').on(table.authorId),
}));

// ============================================
// Attachments Table
// ============================================
export const attachments = pgTable('attachments', {
  id: uuid('id').defaultRandom().primaryKey(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileSize: integer('file_size'),
  fileType: text('file_type'),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }).notNull(),
  uploaderId: uuid('uploader_id').references(() => users.id).notNull(),
  thumbnailUrl: text('thumbnail_url'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// Activity Logs Table
// ============================================
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  projectId: uuid('project_id').references(() => projects.id),
  metadata: jsonb('metadata').default({}),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  severity: text('severity').default('info'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  entityIdx: index('activity_entity_idx').on(table.entityType, table.entityId),
  userIdx: index('activity_user_idx').on(table.userId),
  createdAtIdx: index('activity_created_at_idx').on(table.createdAt),
}));

// ============================================
// Time Entries Table
// ============================================
export const timeEntries = pgTable('time_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id),
  userId: uuid('user_id').references(() => users.id).notNull(),
  projectId: uuid('project_id').references(() => projects.id),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  duration: integer('duration'),
  billable: boolean('billable').default(true),
  hourlyRate: decimal('hourly_rate'),
  tags: jsonb('tags').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('time_entries_user_idx').on(table.userId),
  taskIdx: index('time_entries_task_idx').on(table.taskId),
  dateIdx: index('time_entries_date_idx').on(table.startTime),
}));

// ============================================
// Notifications Table
// ============================================
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').default('info'),
  link: text('link'),
  read: boolean('read').default(false),
  readAt: timestamp('read_at'),
  entityType: text('entity_type'),
  entityId: uuid('entity_id'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  unreadIdx: index('notifications_unread_idx').on(table.userId, table.read),
}));

// ============================================
// Webhooks Table
// ============================================
export const webhooks = pgTable('webhooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  secret: text('secret'),
  events: jsonb('events').default([]),
  active: boolean('active').default(true),
  projectId: uuid('project_id').references(() => projects.id),
  createdBy: uuid('created_by').references(() => users.id),
  lastTriggeredAt: timestamp('last_triggered_at'),
  failureCount: integer('failure_count').default(0),
  headers: jsonb('headers').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================
// Webhook Delivery Logs
// ============================================
export const webhookLogs = pgTable('webhook_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  webhookId: uuid('webhook_id').references(() => webhooks.id, { onDelete: 'cascade' }).notNull(),
  event: text('event').notNull(),
  status: text('status').notNull(),
  statusCode: integer('status_code'),
  requestBody: jsonb('request_body'),
  responseBody: jsonb('response_body'),
  errorMessage: text('error_message'),
  duration: integer('duration'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  webhookIdx: index('webhook_logs_webhook_idx').on(table.webhookId),
}));

// ============================================
// Integrations Table
// ============================================
export const integrations = pgTable('integrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: integrationTypeEnum('type').notNull(),
  name: text('name').notNull(),
  teamId: uuid('team_id').references(() => teams.id),
  projectId: uuid('project_id').references(() => projects.id),
  connected: boolean('connected').default(false),
  connectedBy: uuid('connected_by').references(() => users.id),
  config: jsonb('config').default({}),
  credentials: jsonb('credentials').default({}),
  lastSyncAt: timestamp('last_sync_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================
// Project Labels Table
// ============================================
export const projectLabels = pgTable('project_labels', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  color: text('color').default('#6B7280'),
  description: text('description'),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  projectIdx: index('labels_project_idx').on(table.projectId),
}));

// ============================================
// Project Milestones Table
// ============================================
export const milestones = pgTable('milestones', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  dueDate: timestamp('due_date'),
  status: text('status').default('pending'),
  progress: integer('progress').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================
// Relations
// ============================================
export const usersRelations = relations(users, ({ many }) => ({
  teamMemberships: many(teamMembers),
  assignedTasks: many(tasks, { relationName: 'assignee' }),
  createdTasks: many(tasks, { relationName: 'creator' }),
  comments: many(comments),
  activityLogs: many(activityLogs),
  timeEntries: many(timeEntries),
  notifications: many(notifications),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(teamMembers),
  projects: many(projects),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, { fields: [teamMembers.teamId], references: [teams.id] }),
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  team: one(teams, { fields: [projects.teamId], references: [teams.id] }),
  tasks: many(tasks),
  sprints: many(sprints),
  labels: many(projectLabels),
  milestones: many(milestones),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
  assignee: one(users, { fields: [tasks.assigneeId], references: [users.id], relationName: 'assignee' }),
  creator: one(users, { fields: [tasks.creatorId], references: [users.id], relationName: 'creator' }),
  sprint: one(sprints, { fields: [tasks.sprintId], references: [sprints.id] }),
  parentTask: one(tasks, { fields: [tasks.parentTaskId], references: [tasks.id] }),
  subtasks: many(tasks, { relationName: 'parentTask' }),
  comments: many(comments),
  attachments: many(attachments),
  timeEntries: many(timeEntries),
}));

export const sprintsRelations = relations(sprints, ({ one, many }) => ({
  project: one(projects, { fields: [sprints.projectId], references: [projects.id] }),
  tasks: many(tasks),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  task: one(tasks, { fields: [comments.taskId], references: [tasks.id] }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  parentComment: one(comments, { fields: [comments.parentCommentId], references: [comments.id] }),
  replies: many(comments, { relationName: 'parentComment' }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  task: one(tasks, { fields: [attachments.taskId], references: [tasks.id] }),
  uploader: one(users, { fields: [attachments.uploaderId], references: [users.id] }),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  user: one(users, { fields: [timeEntries.userId], references: [users.id] }),
  task: one(tasks, { fields: [timeEntries.taskId], references: [tasks.id] }),
  project: one(projects, { fields: [timeEntries.projectId], references: [projects.id] }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
  project: one(projects, { fields: [activityLogs.projectId], references: [projects.id] }),
}));