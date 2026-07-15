import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TimeTracker } from '@/components/tracking/TimeTracker';

jest.useFakeTimers();

describe('TimeTracker', () => {
  it('renders initial state', () => {
    render(<TimeTracker />);
    expect(screen.getByText('00:00:00')).toBeInTheDocument();
  });

  it('starts timer on play button click', () => {
    render(<TimeTracker />);
    const playButton = screen.getByRole('button');
    fireEvent.click(playButton);
    
    act(() => { jest.advanceTimersByTime(5000); });
    // Timer should be running
    expect(screen.getByText(/00:00:0[0-9]/)).toBeInTheDocument();
  });

  it('stops timer on stop button click', () => {
    render(<TimeTracker />);
    const playButton = screen.getByRole('button');
    fireEvent.click(playButton);
    
    act(() => { jest.advanceTimersByTime(2000); });
    
    const stopButton = screen.getByRole('button');
    fireEvent.click(stopButton);
    
    // Should be back to 00:00:00
    expect(screen.getByText('00:00:00')).toBeInTheDocument();
  });
});
