import { Router } from 'express';
import type { TaskService } from '../../../application/task.service';
import { asyncHandler } from '../asyncHandler';
import {
  createTaskBodySchema,
  listTasksQuerySchema,
  updateTaskBodySchema,
} from '../schemas/task.schema';
import { validateBody, validateQuery } from '../middleware/validateRequest';

export function createTaskRouter(taskService: TaskService): Router {
  const router = Router();

  router.get(
    '/',
    validateQuery(listTasksQuerySchema),
    asyncHandler(async (_req, res) => {
      const q = res.locals.query;
      const tasks = await taskService.list(q?.status !== undefined ? { status: q.status } : undefined);
      res.json({ data: tasks });
    }),
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const task = await taskService.getById(req.params.id);
      res.json({ data: task });
    }),
  );

  router.post(
    '/',
    validateBody(createTaskBodySchema),
    asyncHandler(async (req, res) => {
      const task = await taskService.create(req.body);
      res.status(201).json({ data: task });
    }),
  );

  router.put(
    '/:id',
    validateBody(updateTaskBodySchema),
    asyncHandler(async (req, res) => {
      const task = await taskService.update(req.params.id, req.body);
      res.json({ data: task });
    }),
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      await taskService.remove(req.params.id);
      res.status(204).send();
    }),
  );

  return router;
}
