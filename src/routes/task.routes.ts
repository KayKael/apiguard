import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const taskController = new TaskController();

router.use(authenticate as any);

router.get('/', (req, res, next) => taskController.getByProject(req as any, res, next));
router.get('/:id', (req, res, next) => taskController.getById(req as any, res, next));
router.post('/', (req, res, next) => taskController.create(req as any, res, next));
router.put('/:id', (req, res, next) => taskController.update(req as any, res, next));
router.delete('/:id', (req, res, next) => taskController.delete(req as any, res, next));

export default router;
