import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SprintCard } from '@/components/sprints/SprintCard';

const mockSprint = {
  id: '1',
  name: 'Sprint 1',
  goal: 'Complete core features',
  startDate: new Date('2024-01-15'),
  endDate: new Date('2024-01-28'),
  status: 'active',
  totalPoints: 34,
  completedPoints: 20,
};

describe('SprintCard', () => {
  it('renders sprint name and goal', () => {
    render(<SprintCard sprint={mockSprint} />);
    expect(screen.getByText('Sprint 1')).toBeInTheDocument();
    expect(screen.getByText('Complete core features')).toBeInTheDocument();
  });

  it('shows progress', () => {
    render(<SprintCard sprint={mockSprint} />);
    expect(screen.getByText('59%')).toBeInTheDocument();
  });

  it('shows points', () => {
    render(<SprintCard sprint={mockSprint} />);
    expect(screen.getByText('20/34')).toBeInTheDocument();
  });

  it('calls onComplete when complete button clicked', () => {
    const handleComplete = jest.fn();
    render(<SprintCard sprint={mockSprint} onComplete={handleComplete} />);
    fireEvent.click(screen.getByText('Complete'));
    expect(handleComplete).toHaveBeenCalledWith('1');
  });

  it('shows start button for planning sprints', () => {
    const planningSprint = { ...mockSprint, status: 'planning' };
    const handleStart = jest.fn();
    render(<SprintCard sprint={planningSprint} onStart={handleStart} />);
    expect(screen.getByText('Start')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Start'));
    expect(handleStart).toHaveBeenCalledWith('1');
  });
});
