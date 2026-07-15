export const APP_NAME = 'ProjectHub';
export const APP_DESCRIPTION = 'Enterprise Project Management Platform';
export const APP_VERSION = '1.0.0';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const TASK_STATUSES = [
  { value: 'backlog', label: 'Backlog', color: '#6B7280', icon: '📋' },
  { value: 'todo', label: 'To Do', color: '#3B82F6', icon: '📌' },
  { value: 'in_progress', label: 'In Progress', color: '#F59E0B', icon: '🔄' },
  { value: 'in_review', label: 'In Review', color: '#8B5CF6', icon: '👀' },
  { value: 'done', label: 'Done', color: '#10B981', icon: '✅' },
] as const;

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: '#10B981', icon: '🟢' },
  { value: 'medium', label: 'Medium', color: '#3B82F6', icon: '🔵' },
  { value: 'high', label: 'High', color: '#F59E0B', icon: '🟠' },
  { value: 'urgent', label: 'Urgent', color: '#EF4444', icon: '🔴' },
] as const;

export const SPRINT_STATUSES = [
  { value: 'planning', label: 'Planning', color: '#3B82F6' },
  { value: 'active', label: 'Active', color: '#10B981' },
  { value: 'completed', label: 'Completed', color: '#6B7280' },
  { value: 'cancelled', label: 'Cancelled', color: '#EF4444' },
] as const;

export const ROLES = [
  { value: 'owner', label: 'Owner', color: '#F59E0B' },
  { value: 'admin', label: 'Admin', color: '#3B82F6' },
  { value: 'member', label: 'Member', color: '#6B7280' },
  { value: 'viewer', label: 'Viewer', color: '#9CA3AF' },
] as const;

export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf', 'text/plain', 'text/csv',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip', 'application/x-zip-compressed',
];

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
};

export const DATE_FORMATS = {
  display: 'MMM d, yyyy',
  displayWithTime: 'MMM d, yyyy h:mm a',
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  api: 'yyyy-MM-dd',
};