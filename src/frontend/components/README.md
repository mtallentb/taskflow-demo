# Task Management Components

This directory contains React TypeScript components for a task management application with drag-and-drop functionality.

## Components

### TaskCard

A reusable task card component that displays task information with drag-and-drop support.

**Features:**
- Display task title, description, priority, assignee, due date, and tags
- Visual priority indicators with color coding
- Drag and drop functionality using @dnd-kit
- Edit and delete actions with hover-to-show buttons
- Accessibility support with ARIA labels and screen reader text
- Responsive design with Tailwind CSS
- Overdue task highlighting

**Props:**
- `task`: Task object containing all task data
- `index`: Position index for drag-and-drop
- `onEdit?`: Optional callback for edit actions
- `onDelete?`: Optional callback for delete actions
- `isDragging?`: Optional prop to indicate dragging state

### TaskBoard

A kanban-style task board that organizes tasks in columns by status.

**Features:**
- Three status columns: To Do, In Progress, Completed
- Drag and drop tasks between columns
- Visual column indicators with task counts
- Empty state handling for columns
- Responsive grid layout
- Keyboard navigation support
- Real-time status updates

**Props:**
- `tasks`: Array of tasks to display
- `onTaskUpdate?`: Optional callback for task updates
- `onTaskDelete?`: Optional callback for task deletion
- `onTaskCreate?`: Optional callback for task creation

## Usage

```tsx
import React, { useState } from 'react';
import { TaskBoard, Task } from './components';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    // Your tasks here
  ]);

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  return (
    <TaskBoard
      tasks={tasks}
      onTaskUpdate={handleTaskUpdate}
      onTaskDelete={(id) => setTasks(t => t.filter(task => task.id !== id))}
    />
  );
};
```

## Dependencies

- `@dnd-kit/core`: Core drag and drop functionality
- `@dnd-kit/sortable`: Sortable drag and drop
- `@dnd-kit/utilities`: Utility functions for drag and drop
- `react`: React framework
- `typescript`: TypeScript support
- `tailwindcss`: Styling framework

## Styling

Components use Tailwind CSS classes for styling. The design features:
- Clean, modern interface
- Priority-based color coding
- Hover effects and smooth transitions
- Responsive design for mobile and desktop
- Accessible color contrast ratios

## Accessibility

Both components include accessibility features:
- ARIA labels for interactive elements
- Screen reader support with descriptive text
- Keyboard navigation support
- Focus management during drag operations
- High contrast colors for readability

## Type Safety

All components are fully typed with TypeScript, using shared types from `../../../shared/types.ts`:
- `Task`: Main task interface
- `TaskStatus`: Union type for task statuses
- `TaskPriority`: Union type for priority levels
- Component-specific prop interfaces

## Example

See `TaskBoardExample.tsx` for a complete example of how to implement the components with state management.