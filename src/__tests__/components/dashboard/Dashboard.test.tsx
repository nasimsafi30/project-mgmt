import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentTasks } from '@/components/dashboard/RecentTasks';

// Mock store
jest.mock('@/store', () => ({
  useKanbanStore: () => ({
    tasks: [
      { id: '1', title: 'Task 1', status: 'todo', priority: 'high', createdAt: new Date().toISOString() },
      { id: '2', title: 'Task 2', status: 'in_progress', priority: 'medium', createdAt: new Date().toISOString() },
      { id: '3', title: 'Task 3', status: 'done', priority: 'low', createdAt: new Date().toISOString() },
    ],
    loading: false,
    error: null,
  }),
}));

describe('DashboardStats', () => {
  it('renders all stat cards', () => {
    render(<DashboardStats />);
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Velocity')).toBeInTheDocument();
  });

  it('displays correct values', () => {
    render(<DashboardStats />);
    expect(screen.getByText('156')).toBeInTheDocument();
    expect(screen.getByText('34')).toBeInTheDocument();
    expect(screen.getByText('89')).toBeInTheDocument();
    expect(screen.getByText('34 pts')).toBeInTheDocument();
  });
});

describe('RecentTasks', () => {
  it('renders recent tasks', () => {
    render(<RecentTasks />);
    expect(screen.getByText('Recent Tasks')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', () => {
    jest.spyOn(require('@/store'), 'useKanbanStore').mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
    });
    render(<RecentTasks />);
    expect(screen.getByText('No tasks')).toBeInTheDocument();
  });
});
