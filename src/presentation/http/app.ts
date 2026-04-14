import path from 'node:path';
import express from 'express';
import type { TaskService } from '../../application/task.service';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { createTaskRouter } from './routes/task.routes';

export function createApp(taskService: TaskService) {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'taskmaster-pro' });
  });

  app.use(express.static(path.join(process.cwd(), 'public')));

  app.use('/api/tasks', createTaskRouter(taskService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
