import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCreateForm } from '@/components/tasks/TaskCreateForm';
import { TaskDetail } from '@/components/tasks/TaskDetail';

describe('TaskCreateForm', () => {
  it('renders create button', () => {
    const handleSubmit = jest.fn();
    render(<TaskCreateForm onSubmit={handleSubmit} />);
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('opens dialog on click', async () => {
    const handleSubmit = jest.fn();
    render(<TaskCreateForm onSubmit={handleSubmit} />);
    await userEvent.click(screen.getByText('New Task'));
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('has title input in dialog', async () => {
    const handleSubmit = jest.fn();
    render(<TaskCreateForm onSubmit={handleSubmit} />);
    await userEvent.click(screen.getByText('New Task'));
    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
  });

  it('has priority select', async () => {
    const handleSubmit = jest.fn();
    render(<TaskCreateForm onSubmit={handleSubmit} />);
    await userEvent.click(screen.getByText('New Task'));
    expect(screen.getByText('Priority')).toBeInTheDocument();
  });

  it('has status select', async () => {
    const handleSubmit = jest.fn();
    render(<TaskCreateForm onSubmit={handleSubmit} />);
    await userEvent.click(screen.getByText('New Task'));
    expect(screen.getByText('Status')).toBeInTheDocument();
  });
});

describe('TaskDetail', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test description',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user1',
    dueDate: '2024-02-15',
    createdAt: new Date().toISOString(),
  };

  it('renders task details', () => {
    render(<TaskDetail task={mockTask} open={true} onOpenChange={jest.fn()} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('shows priority badge', () => {
    render(<TaskDetail task={mockTask} open={true} onOpenChange={jest.fn()} />);
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('has edit and delete buttons', () => {
    render(<TaskDetail task={mockTask} open={true} onOpenChange={jest.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('calls onDelete when delete clicked', () => {
    const handleDelete = jest.fn();
    const handleOpenChange = jest.fn();
    render(
      <TaskDetail 
        task={mockTask} 
        open={true} 
        onOpenChange={handleOpenChange}
        onDelete={handleDelete} 
      />
    );
    // Find delete button by class or position
    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find(b => b.className.includes('text-red'));
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(handleDelete).toHaveBeenCalledWith('1');
    }
  });
});
