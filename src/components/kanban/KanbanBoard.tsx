'use client';

import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { useKanbanStore } from '@/store';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const columns = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
  { id: 'todo', title: 'To Do', color: 'bg-blue-100' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-100' },
  { id: 'in_review', title: 'In Review', color: 'bg-purple-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
] as const;

export function KanbanBoard() {
  const { tasks, moveTask } = useKanbanStore();
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleDragStart = (event: any) => {
    setActiveTask(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeTaskData = tasks.find((t) => t.id === active.id);
    if (!activeTaskData) return;

    const overColumn = columns.find((col) => col.id === over.id);
    if (overColumn) {
      moveTask(active.id, overColumn.id);
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
          {columns.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column.id);
            return (
              <KanbanColumn key={column.id} id={column.id} title={column.title} color={column.color} tasks={columnTasks} />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3">
              <KanbanCard task={tasks.find((t) => t.id === activeTask)!} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
