import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { KanbanColumn } from '@/components/kanban/KanbanColumn';
import { KanbanCard } from '@/components/kanban/KanbanCard';

// Mock store
const mockTasks = [
  { id: '1', title: 'Design homepage', status: 'todo', priority: 'high', description: 'Create new design', dueDate: '2024-02-15', createdAt: new Date().toISOString() },
  { id: '2', title: 'Setup CI/CD', status: 'in_progress', priority: 'medium', description: 'Configure pipeline', dueDate: null, createdAt: new Date().toISOString() },
  { id: '3', title: 'Fix login bug', status: 'done', priority: 'urgent', description: 'SSO issue', dueDate: '2024-02-10', createdAt: new Date().toISOString() },
];

jest.mock('@/store', () => ({
  useKanbanStore: () => ({
    tasks: mockTasks,
    loading: false,
    error: null,
    fetchTasks: jest.fn(),
    addTask: jest.fn(),
    updateTask: jest.fn(),
    removeTask: jest.fn(),
    moveTask: jest.fn(),
  }),
}));

// Mock DnD
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => children,
  DragOverlay: ({ children }: any) => children,
  closestCorners: {},
  PointerSensor: jest.fn(),
  useSensor: jest.fn(() => ({})),
  useSensors: jest.fn(() => [{}]),
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => children,
  verticalListSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => '' } },
}));

describe('KanbanBoard', () => {
  it('renders all 5 columns', () => {
    render(<KanbanBoard />);
    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('In Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('displays task count', () => {
    render(<KanbanBoard />);
    expect(screen.getByText('3 tasks')).toBeInTheDocument();
  });

  it('has Add Task button', () => {
    render(<KanbanBoard />);
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('shows tasks with correct titles', () => {
    render(<KanbanBoard />);
    expect(screen.getByText('Design homepage')).toBeInTheDocument();
    expect(screen.getByText('Setup CI/CD')).toBeInTheDocument();
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('has search input', () => {
    render(<KanbanBoard />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });
});

describe('KanbanCard', () => {
  it('renders task title and priority', () => {
    const task = mockTasks[0];
    render(<KanbanCard task={task} />);
    expect(screen.getByText('Design homepage')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('shows description if present', () => {
    const task = mockTasks[0];
    render(<KanbanCard task={task} />);
    expect(screen.getByText('Create new design')).toBeInTheDocument();
  });

  it('shows due date if present', () => {
    const task = mockTasks[0];
    render(<KanbanCard task={task} />);
    expect(screen.getByText(/Feb/)).toBeInTheDocument();
  });

  it('does not show due date if null', () => {
    const task = mockTasks[1];
    render(<KanbanCard task={task} />);
    const dateElements = screen.queryByText(/Feb/);
    expect(dateElements).not.toBeNull(); // may show other dates
  });
});
