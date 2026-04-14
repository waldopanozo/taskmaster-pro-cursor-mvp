import { AppError } from '../shared/errors/AppError';
import type { Task } from '../domain/task.types';
import { TaskStatus } from '../domain/task.types';
import type {
  CreateTaskInput,
  TaskRepository,
  UpdateTaskInput,
} from './ports/task.repository.port';

export class TaskService {
  constructor(private readonly tasks: TaskRepository) {}

  async create(input: CreateTaskInput): Promise<Task> {
    const title = input.title?.trim();
    if (!title) {
      throw new AppError(400, 'El título es obligatorio', 'VALIDATION_ERROR');
    }
    return this.tasks.create({
      title,
      description: input.description ?? null,
    });
  }

  async getById(id: string): Promise<Task> {
    const task = await this.tasks.findById(id);
    if (!task) {
      throw new AppError(404, 'Tarea no encontrada', 'NOT_FOUND');
    }
    return task;
  }

  async list(filter?: { status?: TaskStatus }): Promise<Task[]> {
    return this.tasks.findAll(filter);
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const existing = await this.tasks.findById(id);
    if (!existing) {
      throw new AppError(404, 'Tarea no encontrada', 'NOT_FOUND');
    }
    const payload: UpdateTaskInput = { ...input };
    if (payload.title !== undefined) {
      const t = payload.title.trim();
      if (!t) {
        throw new AppError(400, 'El título no puede estar vacío', 'VALIDATION_ERROR');
      }
      payload.title = t;
    }
    const updated = await this.tasks.update(id, payload);
    if (!updated) {
      throw new AppError(404, 'Tarea no encontrada', 'NOT_FOUND');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const ok = await this.tasks.delete(id);
    if (!ok) {
      throw new AppError(404, 'Tarea no encontrada', 'NOT_FOUND');
    }
  }
}
