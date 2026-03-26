import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const projectController = new ProjectController();

router.use(authenticate as any);

router.get('/', (req, res, next) => projectController.getAll(req as any, res, next));
router.get('/:id', (req, res, next) => projectController.getById(req as any, res, next));
router.post('/', (req, res, next) => projectController.create(req as any, res, next));
router.put('/:id', (req, res, next) => projectController.update(req as any, res, next));
router.delete('/:id', (req, res, next) => projectController.delete(req as any, res, next));

export default router;
