import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { TaskStatus, TaskPriority } from '@shared/types';
import { AppError } from './errorHandler';

const taskStatusValues = Object.values(TaskStatus);
const taskPriorityValues = Object.values(TaskPriority);

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).optional(),
  status: Joi.string().valid(...taskStatusValues).default(TaskStatus.TODO),
  priority: Joi.string().valid(...taskPriorityValues).default(TaskPriority.MEDIUM),
  assigneeId: Joi.string().uuid().optional(),
  projectId: Joi.string().uuid().optional(),
  dueDate: Joi.string().isoDate().optional(),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional()
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(1000).optional(),
  status: Joi.string().valid(...taskStatusValues).optional(),
  priority: Joi.string().valid(...taskPriorityValues).optional(),
  assigneeId: Joi.string().uuid().optional(),
  projectId: Joi.string().uuid().optional(),
  dueDate: Joi.string().isoDate().optional(),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional()
}).min(1);

export const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'dueDate', 'priority', 'title').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  status: Joi.string().valid(...taskStatusValues).optional(),
  priority: Joi.string().valid(...taskPriorityValues).optional(),
  assigneeId: Joi.string().uuid().optional(),
  projectId: Joi.string().uuid().optional(),
  tags: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional(),
  dueBefore: Joi.string().isoDate().optional(),
  dueAfter: Joi.string().isoDate().optional()
});

export const idSchema = Joi.object({
  id: Joi.string().uuid().required()
});

export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      const validationError = new AppError('Validation failed', 400);
      (validationError as any).details = details;
      throw validationError;
    }

    req[property] = value;
    next();
  };
};