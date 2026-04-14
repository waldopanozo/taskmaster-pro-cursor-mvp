import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodSchema } from 'zod';
import type { ListTasksQuery } from '../schemas/task.schema';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(err);
        return;
      }
      next(err);
    }
  };
}

export function validateQuery(schema: ZodSchema<ListTasksQuery>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.query = schema.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(err);
        return;
      }
      next(err);
    }
  };
}
