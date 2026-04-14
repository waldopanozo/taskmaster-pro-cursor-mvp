import { TaskService } from './task.service';
import { TaskStatus } from '../domain/task.types';
import type { TaskRepository } from './ports/task.repository.port';

describe('TaskService', () => {
  const mockTask = {
    id: '1',
    title: 'Tarea',
    description: null as string | null,
    status: TaskStatus.PENDING,
    createdAt: new Date('2026-01-01'),
  };

  function makeRepo(overrides: Partial<TaskRepository> = {}): TaskRepository {
    return {
      create: jest.fn().mockResolvedValue(mockTask),
      findById: jest.fn().mockResolvedValue(mockTask),
      findAll: jest.fn().mockResolvedValue([mockTask]),
      update: jest.fn().mockResolvedValue({ ...mockTask, title: 'Actualizado' }),
      delete: jest.fn().mockResolvedValue(true),
      ...overrides,
    };
  }

  it('create rechaza título vacío', async () => {
    const service = new TaskService(makeRepo());
    await expect(service.create({ title: '   ' })).rejects.toMatchObject({ statusCode: 400 });
  });

  it('getById lanza 404 si no existe', async () => {
    const service = new TaskService(makeRepo({ findById: jest.fn().mockResolvedValue(null) }));
    await expect(service.getById('x')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('list delega el filtro de estado', async () => {
    const findAll = jest.fn().mockResolvedValue([]);
    const service = new TaskService(makeRepo({ findAll }));
    await service.list({ status: TaskStatus.COMPLETED });
    expect(findAll).toHaveBeenCalledWith({ status: TaskStatus.COMPLETED });
  });

  it('remove lanza 404 si delete devuelve false', async () => {
    const service = new TaskService(makeRepo({ delete: jest.fn().mockResolvedValue(false) }));
    await expect(service.remove('x')).rejects.toMatchObject({ statusCode: 404 });
  });
});
