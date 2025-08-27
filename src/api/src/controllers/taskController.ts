import { Request, Response } from 'express';
import { 
  ApiResponse, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilters, 
  PaginationQuery 
} from '@shared/types';
import { taskService } from '../services/taskService';
import { asyncHandler } from '../middleware/errorHandler';

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const taskData: CreateTaskRequest = req.body;
  const task = await taskService.createTask(taskData);
  
  const response: ApiResponse<typeof task> = {
    success: true,
    data: task,
    message: 'Task created successfully'
  };

  res.status(201).json(response);
});

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as any;
  
  const filters: TaskFilters = {
    status: query.status,
    priority: query.priority,
    assigneeId: query.assigneeId,
    projectId: query.projectId,
    tags: query.tags ? (Array.isArray(query.tags) ? query.tags : [query.tags]) : undefined,
    dueBefore: query.dueBefore,
    dueAfter: query.dueAfter
  };

  const pagination: PaginationQuery = {
    page: query.page,
    limit: query.limit,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder
  };

  const result = await taskService.getTasks(filters, pagination);
  
  const response: ApiResponse<typeof result> = {
    success: true,
    data: result
  };

  res.json(response);
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await taskService.getTaskById(id);
  
  const response: ApiResponse<typeof task> = {
    success: true,
    data: task
  };

  res.json(response);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: UpdateTaskRequest = req.body;
  
  const task = await taskService.updateTask(id, updateData);
  
  const response: ApiResponse<typeof task> = {
    success: true,
    data: task,
    message: 'Task updated successfully'
  };

  res.json(response);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await taskService.deleteTask(id);
  
  const response: ApiResponse<null> = {
    success: true,
    message: 'Task deleted successfully'
  };

  res.json(response);
});

export const getTaskStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await taskService.getTaskStats();
  
  const response: ApiResponse<typeof stats> = {
    success: true,
    data: stats
  };

  res.json(response);
});