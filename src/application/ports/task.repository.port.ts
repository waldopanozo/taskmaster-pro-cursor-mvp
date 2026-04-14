import type { Task, TaskStatus } from '../../domain/task.types';

export interface CreateTaskInput {
  title: string;
  description?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
}

export interface TaskRepository {
  create(data: CreateTaskInput): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(filter?: { status?: TaskStatus }): Promise<Task[]>;
  update(id: string, data: UpdateTaskInput): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}
