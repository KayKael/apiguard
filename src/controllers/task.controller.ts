import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { TaskService } from '../services/task.service';
import { AuthRequest } from '../middleware/auth.middleware';

const taskService = new TaskService();

const taskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  project_id: z.number(),
  assigned_to: z.number().optional(),
  due_date: z.string().datetime().optional(),
});

export class TaskController {
  async getByProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projectId = parseInt(req.query.project_id as string);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: 'project_id is required' });
      }
      const tasks = await taskService.getTasksByProject(projectId, req.user!.id);
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const task = await taskService.getTaskById(parseInt(req.params.id), req.user!.id);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = taskSchema.parse(req.body);
      const task = await taskService.createTask(
        {
          ...validatedData,
          due_date: validatedData.due_date ? new Date(validatedData.due_date) : undefined,
        },
        req.user!.id
      );
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = taskSchema.partial().parse(req.body);
      const task = await taskService.updateTask(
        parseInt(req.params.id),
        req.user!.id,
        {
          ...validatedData,
          due_date: validatedData.due_date ? new Date(validatedData.due_date) : undefined,
        }
      );
      res.status(200).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await taskService.deleteTask(parseInt(req.params.id), req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
