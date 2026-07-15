import { NextResponse } from 'next/server';

export async function GET() {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'ProjectHub API',
      version: '1.0.0',
      description: 'Enterprise Project Management Platform API Documentation',
      contact: { name: 'API Support', email: 'api@projecthub.com' },
    },
    servers: [
      { url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', description: 'Production' },
      { url: 'http://localhost:3000', description: 'Development' },
    ],
    tags: [
      { name: 'Tasks', description: 'Task management' },
      { name: 'Projects', description: 'Project operations' },
      { name: 'Teams', description: 'Team management' },
      { name: 'Users', description: 'User operations' },
      { name: 'Comments', description: 'Comment operations' },
      { name: 'Attachments', description: 'File attachments' },
      { name: 'Sprints', description: 'Sprint management' },
      { name: 'Time Tracking', description: 'Time entry operations' },
      { name: 'Analytics', description: 'Analytics & reports' },
      { name: 'Webhooks', description: 'Webhook management' },
      { name: 'Integrations', description: 'Third-party integrations' },
      { name: 'Plugins', description: 'Plugin marketplace' },
    ],
    paths: {
      '/api/tasks': {
        get: { tags: ['Tasks'], summary: 'List tasks', parameters: [{ name: 'projectId', in: 'query', schema: { type: 'string' } }, { name: 'status', in: 'query', schema: { type: 'string' } }, { name: 'priority', in: 'query', schema: { type: 'string' } }, { name: 'search', in: 'query', schema: { type: 'string' } }], responses: { '200': { description: 'List of tasks' } } },
        post: { tags: ['Tasks'], summary: 'Create task', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['title'], properties: { title: { type: 'string' }, description: { type: 'string' }, status: { type: 'string', enum: ['backlog', 'todo', 'in_progress', 'in_review', 'done'] }, priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] }, projectId: { type: 'string' } } } } } }, responses: { '201': { description: 'Task created' }, '400': { description: 'Validation error' } } },
      },
      '/api/tasks/{id}': {
        get: { tags: ['Tasks'], summary: 'Get task', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Task details' } } },
        patch: { tags: ['Tasks'], summary: 'Update task', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Task updated' } } },
        delete: { tags: ['Tasks'], summary: 'Delete task', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Task deleted' } } },
      },
      '/api/projects': {
        get: { tags: ['Projects'], summary: 'List projects', responses: { '200': { description: 'List of projects' } } },
        post: { tags: ['Projects'], summary: 'Create project', responses: { '201': { description: 'Project created' } } },
      },
      '/api/teams': {
        get: { tags: ['Teams'], summary: 'List teams', responses: { '200': { description: 'List of teams' } } },
        post: { tags: ['Teams'], summary: 'Create team', responses: { '201': { description: 'Team created' } } },
      },
      '/api/comments': {
        get: { tags: ['Comments'], summary: 'List comments', parameters: [{ name: 'taskId', in: 'query', schema: { type: 'string' } }], responses: { '200': { description: 'List of comments' } } },
        post: { tags: ['Comments'], summary: 'Add comment', responses: { '201': { description: 'Comment added' } } },
      },
      '/api/attachments': {
        get: { tags: ['Attachments'], summary: 'List attachments', responses: { '200': { description: 'List of attachments' } } },
        post: { tags: ['Attachments'], summary: 'Upload attachment', responses: { '201': { description: 'File uploaded' } } },
      },
      '/api/sprints': {
        get: { tags: ['Sprints'], summary: 'List sprints', responses: { '200': { description: 'List of sprints' } } },
        post: { tags: ['Sprints'], summary: 'Create sprint', responses: { '201': { description: 'Sprint created' } } },
      },
      '/api/time-entries': {
        get: { tags: ['Time Tracking'], summary: 'List time entries', responses: { '200': { description: 'List of time entries' } } },
        post: { tags: ['Time Tracking'], summary: 'Create time entry', responses: { '201': { description: 'Time entry created' } } },
      },
      '/api/analytics': {
        get: { tags: ['Analytics'], summary: 'Get analytics', parameters: [{ name: 'period', in: 'query', schema: { type: 'string' } }], responses: { '200': { description: 'Analytics data' } } },
      },
      '/api/webhooks': {
        get: { tags: ['Webhooks'], summary: 'List webhooks', responses: { '200': { description: 'List of webhooks' } } },
        post: { tags: ['Webhooks'], summary: 'Create webhook', responses: { '201': { description: 'Webhook created' } } },
      },
      '/api/integrations': {
        get: { tags: ['Integrations'], summary: 'List integrations', responses: { '200': { description: 'List of integrations' } } },
      },
      '/api/plugins/marketplace': {
        get: { tags: ['Plugins'], summary: 'List marketplace plugins', responses: { '200': { description: 'List of plugins' } } },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        apiKey: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
      },
      schemas: {
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['backlog', 'todo', 'in_progress', 'in_review', 'done'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
            projectId: { type: 'string', format: 'uuid' },
            assigneeId: { type: 'string', format: 'uuid' },
            dueDate: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: { type: 'object', properties: { error: { type: 'string' }, details: { type: 'string' } } },
      },
    },
    security: [{ bearerAuth: [] }],
  };

  return NextResponse.json(spec);
}
