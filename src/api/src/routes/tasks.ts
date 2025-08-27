import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/taskController';
import {
  validate,
  createTaskSchema,
  updateTaskSchema,
  querySchema,
  idSchema
} from '../middleware/validation';

const router = Router();

router.post('/', 
  validate(createTaskSchema, 'body'),
  createTask
);

router.get('/', 
  validate(querySchema, 'query'),
  getTasks
);

router.get('/stats', 
  getTaskStats
);

router.get('/:id', 
  validate(idSchema, 'params'),
  getTaskById
);

router.put('/:id', 
  validate(idSchema, 'params'),
  validate(updateTaskSchema, 'body'),
  updateTask
);

router.delete('/:id', 
  validate(idSchema, 'params'),
  deleteTask
);

export { router as tasksRouter };