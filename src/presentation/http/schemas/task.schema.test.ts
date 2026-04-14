import { TaskStatus } from '../../../domain/task.types';
import { createTaskBodySchema, listTasksQuerySchema, updateTaskBodySchema } from './task.schema';

describe('task.schema', () => {
  it('createTaskBodySchema exige título no vacío', () => {
    expect(() => createTaskBodySchema.parse({ title: '' })).toThrow();
    expect(createTaskBodySchema.parse({ title: 'Ok', description: null })).toEqual({
      title: 'Ok',
      description: null,
    });
  });

  it('listTasksQuerySchema acepta status opcional', () => {
    expect(listTasksQuerySchema.parse({})).toEqual({});
    expect(listTasksQuerySchema.parse({ status: TaskStatus.PENDING })).toEqual({
      status: TaskStatus.PENDING,
    });
  });

  it('updateTaskBodySchema exige al menos un campo', () => {
    expect(() => updateTaskBodySchema.parse({})).toThrow();
    expect(updateTaskBodySchema.parse({ status: TaskStatus.COMPLETED })).toEqual({
      status: TaskStatus.COMPLETED,
    });
  });
});
