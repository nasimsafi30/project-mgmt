import { NextRequest, NextResponse } from 'next/server';

const templates = [
  {
    id: 'agile-software',
    name: 'Agile Software Development',
    description: 'Standard agile development project with sprints, backlogs, and retrospectives',
    category: 'software',
    icon: 'code',
    settings: {
      defaultView: 'kanban',
      workflows: ['backlog', 'todo', 'in_progress', 'in_review', 'done'],
      labels: ['bug', 'feature', 'improvement', 'tech-debt'],
    },
    tasks: [
      { title: 'Set up repository', status: 'todo', priority: 'high' },
      { title: 'Define project scope', status: 'todo', priority: 'high' },
      { title: 'Create wireframes', status: 'backlog', priority: 'medium' },
    ],
  },
  {
    id: 'marketing-campaign',
    name: 'Marketing Campaign',
    description: 'Plan and execute marketing campaigns with content calendars',
    category: 'marketing',
    icon: 'megaphone',
    settings: {
      defaultView: 'calendar',
      workflows: ['planning', 'in_progress', 'review', 'published'],
      labels: ['social-media', 'email', 'blog', 'ads'],
    },
    tasks: [
      { title: 'Define campaign goals', status: 'planning', priority: 'high' },
      { title: 'Create content calendar', status: 'planning', priority: 'high' },
      { title: 'Design assets', status: 'backlog', priority: 'medium' },
    ],
  },
  {
    id: 'design-sprint',
    name: 'Design Sprint',
    description: '5-day design sprint process for rapid prototyping',
    category: 'design',
    icon: 'palette',
    settings: {
      defaultView: 'kanban',
      workflows: ['understand', 'sketch', 'decide', 'prototype', 'validate'],
      labels: ['research', 'design', 'prototype', 'testing'],
    },
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Comprehensive product launch checklist',
    category: 'product',
    icon: 'rocket',
    settings: {
      defaultView: 'gantt',
      workflows: ['pre-launch', 'launch-day', 'post-launch'],
      labels: ['critical', 'marketing', 'engineering', 'support'],
    },
  },
  {
    id: 'empty',
    name: 'Blank Project',
    description: 'Start from scratch with a completely empty project',
    category: 'general',
    icon: 'file',
    settings: {
      defaultView: 'kanban',
      workflows: ['backlog', 'todo', 'in_progress', 'done'],
      labels: [],
    },
  },
];

/**
 * GET /api/projects/templates
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  let result = templates;
  if (category && category !== 'all') {
    result = templates.filter(t => t.category === category);
  }
  
  return NextResponse.json({ templates: result, total: result.length });
}
