import type { Task as PrismaTask } from '@prisma/client';
import { TaskStatus as PrismaTaskStatus } from '@prisma/client';
import type { Task } from '../../domain/task.types';
import { TaskStatus } from '../../domain/task.types';
import type {
  CreateTaskInput,
  TaskRepository,
  UpdateTaskInput,
} from '../../application/ports/task.repository.port';
import { prisma } from '../prisma/prisma.client';

function toDomain(row: PrismaTask): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as TaskStatus,
    createdAt: row.createdAt,
  };
}

function toPrismaStatus(status: TaskStatus): PrismaTaskStatus {
  return status === TaskStatus.COMPLETED
    ? PrismaTaskStatus.COMPLETED
    : PrismaTaskStatus.PENDING;
}

export class PrismaTaskRepository implements TaskRepository {
  async create(data: CreateTaskInput): Promise<Task> {
    const row = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
      },
    });
    return toDomain(row);
  }

  async findById(id: string): Promise<Task | null> {
    const row = await prisma.task.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findAll(filter?: { status?: TaskStatus }): Promise<Task[]> {
    const rows = await prisma.task.findMany({
      where: filter?.status ? { status: toPrismaStatus(filter.status) } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(toDomain);
  }

  async update(id: string, data: UpdateTaskInput): Promise<Task | null> {
    try {
      const row = await prisma.task.update({
        where: { id },
        data: {
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.status !== undefined ? { status: toPrismaStatus(data.status) } : {}),
        },
      });
      return toDomain(row);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.task.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
