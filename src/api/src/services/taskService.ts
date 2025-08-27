import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilters, 
  PaginationQuery,
  PaginatedResponse,
  TaskStatus,
  TaskPriority
} from '@shared/types';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler';

class TaskService {
  private tasks: Task[] = [];

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const now = new Date().toISOString();
    
    const task: Task = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: data.status || TaskStatus.TODO,
      priority: data.priority || TaskPriority.MEDIUM,
      assigneeId: data.assigneeId,
      projectId: data.projectId,
      dueDate: data.dueDate,
      createdAt: now,
      updatedAt: now,
      tags: data.tags || []
    };

    this.tasks.push(task);
    return task;
  }

  async getTasks(
    filters: TaskFilters = {}, 
    pagination: PaginationQuery = {}
  ): Promise<PaginatedResponse<Task>> {
    let filteredTasks = this.tasks;

    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }

    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    if (filters.assigneeId) {
      filteredTasks = filteredTasks.filter(task => task.assigneeId === filters.assigneeId);
    }

    if (filters.projectId) {
      filteredTasks = filteredTasks.filter(task => task.projectId === filters.projectId);
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        task.tags && filters.tags!.some(tag => task.tags!.includes(tag))
      );
    }

    if (filters.dueBefore) {
      filteredTasks = filteredTasks.filter(task => 
        task.dueDate && new Date(task.dueDate) <= new Date(filters.dueBefore!)
      );
    }

    if (filters.dueAfter) {
      filteredTasks = filteredTasks.filter(task => 
        task.dueDate && new Date(task.dueDate) >= new Date(filters.dueAfter!)
      );
    }

    const sortBy = pagination.sortBy || 'createdAt';
    const sortOrder = pagination.sortOrder || 'desc';

    filteredTasks.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Task];
      let bValue: any = b[sortBy as keyof Task];

      if (sortBy === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
        aValue = priorityOrder[aValue as TaskPriority];
        bValue = priorityOrder[bValue as TaskPriority];
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    return {
      data: paginatedTasks,
      pagination: {
        page,
        limit,
        total: filteredTasks.length,
        totalPages: Math.ceil(filteredTasks.length / limit)
      }
    };
  }

  async getTaskById(id: string): Promise<Task> {
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new AppError('Task not found', 404);
    }

    const updatedTask: Task = {
      ...this.tasks[taskIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new AppError('Task not found', 404);
    }

    this.tasks.splice(taskIndex, 1);
  }

  async getTaskStats(): Promise<{
    total: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
  }> {
    const total = this.tasks.length;
    
    const byStatus = Object.values(TaskStatus).reduce((acc, status) => {
      acc[status] = this.tasks.filter(task => task.status === status).length;
      return acc;
    }, {} as Record<TaskStatus, number>);

    const byPriority = Object.values(TaskPriority).reduce((acc, priority) => {
      acc[priority] = this.tasks.filter(task => task.priority === priority).length;
      return acc;
    }, {} as Record<TaskPriority, number>);

    return { total, byStatus, byPriority };
  }
}

export const taskService = new TaskService();