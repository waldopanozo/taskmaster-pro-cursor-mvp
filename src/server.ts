import 'dotenv/config';
import { createServer } from 'node:http';
import { TaskService } from './application/task.service';
import { PrismaTaskRepository } from './infrastructure/repositories/prisma-task.repository';
import { createApp } from './presentation/http/app';

const port = Number(process.env.PORT) || 3000;

const taskRepository = new PrismaTaskRepository();
const taskService = new TaskService(taskRepository);
const app = createApp(taskService);

const server = createServer(app);

server.listen(port, () => {
  console.log(`TaskMaster Pro escuchando en http://localhost:${port}`);
});
