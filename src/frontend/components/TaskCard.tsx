import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskPriority, TaskCardProps } from '../../../shared/types';

interface TaskCardComponentProps extends TaskCardProps {
  task: Task;
  index: number;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardComponentProps> = ({
  task,
  index,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Priority color mapping
  const getPriorityColor = (priority: TaskPriority): string => {
    const colors = {
      low: 'border-l-green-500 bg-green-50',
      medium: 'border-l-yellow-500 bg-yellow-50',
      high: 'border-l-orange-500 bg-orange-50',
      urgent: 'border-l-red-500 bg-red-50',
    };
    return colors[priority];
  };

  // Format date helper
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if task is overdue
  const isOverdue = (dueDate: Date | string): boolean => {
    if (!dueDate) return false;
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    return due < new Date() && task.status !== 'completed';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3
        hover:shadow-md hover:border-gray-300 transition-all duration-200
        cursor-grab active:cursor-grabbing
        ${getPriorityColor(task.priority)}
        border-l-4
        ${isDragging ? 'opacity-50 scale-105 shadow-lg' : ''}
      `}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-2">
          {task.title}
        </h3>
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-150"
              aria-label="Edit task"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-150 ml-1"
              aria-label="Delete task"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {/* Priority Indicator */}
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-1 ${
                task.priority === 'urgent'
                  ? 'bg-red-500'
                  : task.priority === 'high'
                  ? 'bg-orange-500'
                  : task.priority === 'medium'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            />
            <span className="capitalize">{task.priority}</span>
          </div>

          {/* Assignee */}
          {task.assignee && (
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-1">
                <span className="text-xs font-medium text-blue-800">
                  {task.assignee.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="truncate max-w-20">{task.assignee}</span>
            </div>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div
            className={`flex items-center ${
              isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className={isOverdue(task.dueDate) ? 'font-medium' : ''}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        )}
      </div>

      {/* Accessibility */}
      <div className="sr-only">
        Task: {task.title}
        {task.description && `, Description: ${task.description}`}
        , Status: {task.status}
        , Priority: {task.priority}
        {task.assignee && `, Assigned to: ${task.assignee}`}
        {task.dueDate && `, Due: ${formatDate(task.dueDate)}`}
      </div>
    </div>
  );
};

export default TaskCard;