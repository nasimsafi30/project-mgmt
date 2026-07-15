# ProjectHub API Documentation

## Base URL: `/api`

## Tasks
- GET /api/tasks - List tasks
- POST /api/tasks - Create task
- GET /api/tasks/:id - Get task
- PATCH /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task

## Projects
- GET /api/projects - List projects
- POST /api/projects - Create project
- GET /api/projects/:id - Get project
- PATCH /api/projects/:id - Update project
- DELETE /api/projects/:id - Delete project

## Teams
- GET /api/teams - List teams
- POST /api/teams - Create team
- GET /api/teams/:id - Get team

## Sprints
- GET /api/sprints - List sprints
- POST /api/sprints - Create sprint
- POST /api/sprints/:id/start - Start sprint
- POST /api/sprints/:id/complete - Complete sprint

## Time Entries
- GET /api/time-entries - List entries
- POST /api/time-entries - Create entry
- POST /api/time-entries/start - Start timer
- POST /api/time-entries/stop - Stop timer

## Authentication
Bearer token via Clerk JWT
