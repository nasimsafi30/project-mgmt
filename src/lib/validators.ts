import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().max(2000).optional().nullable(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'in_review', 'done']).default('backlog'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  projectId: z.string().uuid('Invalid project ID'),
  assigneeId: z.string().uuid().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  labels: z.array(z.string()).optional().default([]),
  storyPoints: z.number().min(0).max(100).optional().nullable(),
  sprintId: z.string().uuid().optional().nullable(),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(1000).optional().nullable(),
  teamId: z.string().uuid('Invalid team ID'),
  visibility: z.enum(['public', 'private']).default('private'),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const teamSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().nullable(),
});

export const sprintSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  goal: z.string().max(500).optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  totalPoints: z.number().min(0).default(0),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000),
  taskId: z.string().uuid(),
  authorId: z.string().uuid(),
});

export const timeEntrySchema = z.object({
  taskTitle: z.string().min(1),
  projectName: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional().nullable(),
  duration: z.number().min(0),
  description: z.string().max(500).optional(),
  billable: z.boolean().default(true),
});

export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('light'),
  language: z.string().default('en'),
  timezone: z.string().default('UTC'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    desktop: z.boolean().default(false),
    taskAssigned: z.boolean().default(true),
    taskCompleted: z.boolean().default(true),
    comments: z.boolean().default(true),
    mentions: z.boolean().default(true),
  }),
});

export const webhookSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url('Must be a valid URL'),
  events: z.array(z.string()).min(1, 'At least one event is required'),
  active: z.boolean().default(true),
  secret: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type TeamFormData = z.infer<typeof teamSchema>;
export type SprintFormData = z.infer<typeof sprintSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type TimeEntryFormData = z.infer<typeof timeEntrySchema>;
export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
export type WebhookFormData = z.infer<typeof webhookSchema>;