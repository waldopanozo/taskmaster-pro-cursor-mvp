import type { ListTasksQuery } from '../presentation/http/schemas/task.schema';

declare global {
  namespace Express {
    interface Locals {
      query?: ListTasksQuery;
    }
  }
}

export {};
