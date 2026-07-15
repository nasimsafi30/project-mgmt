require('@testing-library/jest-dom');

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/link
jest.mock('next/link', () => {
  const React = require('react');
  return ({ children, ...props }) => React.createElement('a', props, children);
});

// Mock sonner
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } }));

// Mock lucide-react
jest.mock('lucide-react', () => new Proxy({}, { get: () => (props) => require('react').createElement('svg', props) }));

// Mock recharts
jest.mock('recharts', () => {
  const React = require('react');
  return {
    AreaChart: 'div', Area: 'div', BarChart: 'div', Bar: 'div', PieChart: 'div', Pie: 'div', Cell: 'div',
    LineChart: 'div', Line: 'div', XAxis: 'div', YAxis: 'div', CartesianGrid: 'div',
    Tooltip: 'div', Legend: 'div', ResponsiveContainer: ({ children }) => React.createElement('div', null, children),
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', button: 'button' },
  AnimatePresence: ({ children }) => children,
}));

// Mock DnD Kit
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }) => children,
  DragOverlay: ({ children }) => children,
  closestCorners: {},
  PointerSensor: jest.fn(),
  KeyboardSensor: jest.fn(),
  useSensor: jest.fn(() => ({})),
  useSensors: jest.fn(() => [{}]),
  useDroppable: () => ({ setNodeRef: jest.fn(), isOver: false }),
  useDraggable: () => ({ attributes: {}, listeners: {}, setNodeRef: jest.fn(), transform: null }),
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }) => children,
  verticalListSortingStrategy: {},
  sortableKeyboardCoordinates: {},
  useSortable: () => ({ attributes: {}, listeners: {}, setNodeRef: jest.fn(), transform: null, transition: null, isDragging: false }),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => '' } },
}));

console.log('✅ jest.setup.js loaded!');
