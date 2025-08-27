// Export all components for easier importing
export { default as TaskCard } from './TaskCard';
export { default as TaskBoard } from './TaskBoard';

// Re-export types for convenience
export type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskColumn,
  TaskCardProps,
  TaskBoardProps,
} from '../../../shared/types';