import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock store
jest.mock('@/store', () => ({
  useUIStore: () => ({
    sidebarOpen: true,
    toggleSidebar: jest.fn(),
  }),
  useKanbanStore: () => ({
    tasks: [],
  }),
}));

describe('Header', () => {
  it('renders notification bell', () => {
    render(<Header />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('has user avatar', () => {
    render(<Header />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
});

describe('Sidebar', () => {
  it('renders navigation items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Board')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('has new task button', () => {
    render(<Sidebar />);
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('shows ProjectHub branding', () => {
    render(<Sidebar />);
    expect(screen.getByText('ProjectHub')).toBeInTheDocument();
  });
});
