import React, { useState } from 'react';
import TaskBoard from './TaskBoard';
import { Task } from '../../../shared/types';

// Example usage component demonstrating how to use TaskBoard
const TaskBoardExample: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design user interface mockups',
      description: 'Create wireframes and high-fidelity designs for the new feature',
      status: 'todo',
      priority: 'high',
      assignee: 'Alice Johnson',
      dueDate: new Date('2024-01-15'),
      tags: ['design', 'ui/ux'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: 'Implement authentication system',
      description: 'Set up user login, registration, and password recovery',
      status: 'in-progress',
      priority: 'urgent',
      assignee: 'Bob Smith',
      dueDate: new Date('2024-01-20'),
      tags: ['backend', 'security'],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-03'),
    },
    {
      id: '3',
      title: 'Write unit tests',
      description: 'Add comprehensive test coverage for the core modules',
      status: 'todo',
      priority: 'medium',
      assignee: 'Charlie Brown',
      dueDate: new Date('2024-01-25'),
      tags: ['testing', 'quality'],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
    {
      id: '4',
      title: 'Deploy to staging environment',
      description: 'Set up CI/CD pipeline and deploy the application',
      status: 'completed',
      priority: 'low',
      assignee: 'David Wilson',
      dueDate: new Date('2024-01-10'),
      tags: ['devops', 'deployment'],
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-10'),
    },
    {
      id: '5',
      title: 'Code review and refactoring',
      description: 'Review existing code and refactor for better maintainability',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Eve Davis',
      tags: ['code-quality', 'refactoring'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-06'),
    },
  ]);

  // Handle task updates (status changes, edits)
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  // Handle task deletion
  const handleTaskDelete = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Handle task creation
  const handleTaskCreate = (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(), // Simple ID generation for demo
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prevTasks => [...prevTasks, task]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskBoard
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskCreate={handleTaskCreate}
      />
    </div>
  );
};

export default TaskBoardExample;