# ProjectHub Architecture

## Stack
- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS
- Backend: Next.js API Routes, GraphQL
- Database: Neon PostgreSQL, Drizzle ORM
- Real-time: Pusher
- Auth: Clerk
- Cache: Upstash Redis
- Infrastructure: AWS ECS, Terraform

## Database
17 tables: users, teams, projects, tasks, sprints, comments, attachments, activity_logs, time_entries, notifications, webhooks, integrations, project_labels, milestones

## Security
- JWT via Clerk
- RBAC (Owner, Admin, Member, Viewer)
- TLS 1.3
- Audit logging
