import React, { useState, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  Over,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';

import TaskCard from './TaskCard';
import { Task, TaskStatus, TaskColumn, TaskBoardProps } from '../../../shared/types';

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Set up drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Define task columns
  const columnDefinitions: Omit<TaskColumn, 'tasks'>[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' },
  ];

  // Group tasks by status
  const taskColumns: TaskColumn[] = useMemo(() => {
    return columnDefinitions.map(col => ({
      ...col,
      tasks: tasks.filter(task => task.status === col.id),
    }));
  }, [tasks]);

  // Get column header styling based on status
  const getColumnHeaderStyling = (status: TaskStatus): string => {
    const styles = {
      'todo': 'bg-blue-50 border-blue-200 text-blue-800',
      'in-progress': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'completed': 'bg-green-50 border-green-200 text-green-800',
    };
    return styles[status];
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    // Determine if we're dropping on a column or another task
    let targetStatus: TaskStatus;
    let targetIndex: number;

    // Check if dropping on a column header/area
    if (['todo', 'in-progress', 'completed'].includes(overId)) {
      targetStatus = overId as TaskStatus;
      const targetColumn = taskColumns.find(col => col.id === targetStatus);
      targetIndex = targetColumn ? targetColumn.tasks.length : 0;
    } else {
      // Dropping on another task
      const overTask = tasks.find(task => task.id === overId);
      if (!overTask) return;
      
      targetStatus = overTask.status;
      const targetColumn = taskColumns.find(col => col.id === targetStatus);
      targetIndex = targetColumn ? targetColumn.tasks.findIndex(task => task.id === overId) : 0;
    }

    // Update task status if it changed
    if (activeTask.status !== targetStatus && onTaskUpdate) {
      onTaskUpdate(activeId, { status: targetStatus });
    }
  };

  // Handle drag over (for real-time feedback)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    // Don't do anything if hovering over the same task
    if (activeId === overId) return;
  };

  // Find active task for drag overlay
  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Task Board</h1>
        <p className="text-gray-600">
          Drag and drop tasks between columns to update their status
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {taskColumns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              onEdit={onTaskUpdate ? (task) => onTaskUpdate(task.id, task) : undefined}
              onDelete={onTaskDelete}
              getColumnHeaderStyling={getColumnHeaderStyling}
            />
          ))}
        </div>

        {/* Custom drag overlay */}
        {activeTask && (
          <div className="fixed pointer-events-none z-50 opacity-80">
            <TaskCard
              task={activeTask}
              index={0}
              isDragging={true}
            />
          </div>
        )}
      </DndContext>
    </div>
  );
};

// TaskColumn component for better organization
interface TaskColumnProps {
  column: TaskColumn;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  getColumnHeaderStyling: (status: TaskStatus) => string;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  onEdit,
  onDelete,
  getColumnHeaderStyling,
}) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Column Header */}
      <div
        className={`px-4 py-3 border-b border-gray-200 ${getColumnHeaderStyling(
          column.id
        )}`}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">{column.title}</h2>
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-white bg-opacity-80 rounded-full">
            {column.tasks.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-4 min-h-[200px]">
        <SortableContext
          items={column.tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-xs text-center">
                {column.id === 'todo' && 'No tasks to do'}
                {column.id === 'in-progress' && 'No tasks in progress'}
                {column.id === 'completed' && 'No completed tasks'}
              </p>
            </div>
          ) : (
            column.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </SortableContext>
      </div>

      {/* Drop zone indicator when dragging */}
      <div
        id={column.id}
        className="h-4 opacity-0 hover:opacity-100 transition-opacity duration-200"
        style={{
          background: `linear-gradient(to bottom, transparent, ${
            column.id === 'todo'
              ? 'rgba(59, 130, 246, 0.1)'
              : column.id === 'in-progress'
              ? 'rgba(245, 158, 11, 0.1)'
              : 'rgba(34, 197, 94, 0.1)'
          })`,
        }}
        role="region"
        aria-label={`Drop zone for ${column.title} column`}
      />
    </div>
  );
};

export default TaskBoard;