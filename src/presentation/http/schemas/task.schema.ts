import { z } from 'zod';
import { TaskStatus } from '../../../domain/task.types';

export const createTaskBodySchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().nullable().optional(),
});

export const updateTaskBodySchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar',
  });

export const listTasksQuerySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
});

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
