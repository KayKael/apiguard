import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { ProjectService } from '../services/project.service';
import { AuthRequest } from '../middleware/auth.middleware';

const projectService = new ProjectService();

const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export class ProjectController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projects = await projectService.getProjects(req.user!.id);
      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await projectService.getProjectById(parseInt(req.params.id), req.user!.id);
      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = projectSchema.parse(req.body);
      const project = await projectService.createProject({
        ...validatedData,
        owner_id: req.user!.id,
      });
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = projectSchema.partial().parse(req.body);
      const project = await projectService.updateProject(
        parseInt(req.params.id),
        req.user!.id,
        validatedData
      );
      res.status(200).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await projectService.deleteProject(parseInt(req.params.id), req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
