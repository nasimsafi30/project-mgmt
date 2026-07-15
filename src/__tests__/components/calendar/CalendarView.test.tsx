import React from 'react';
import { render, screen } from '@testing-library/react';
import { CalendarView } from '@/components/calendar/CalendarView';

jest.mock('@/store', () => ({
  useKanbanStore: () => ({
    tasks: [
      { id: '1', title: 'Task 1', status: 'todo', priority: 'high', dueDate: '2024-02-15', createdAt: new Date().toISOString() },
      { id: '2', title: 'Task 2', status: 'in_progress', priority: 'medium', dueDate: '2024-02-15', createdAt: new Date().toISOString() },
    ],
  }),
}));

describe('CalendarView', () => {
  it('renders month and year', () => {
    render(<CalendarView />);
    const today = new Date();
    const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    expect(screen.getByText(monthYear)).toBeInTheDocument();
  });

  it('has navigation buttons', () => {
    render(<CalendarView />);
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('renders day headers', () => {
    render(<CalendarView />);
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });
});
