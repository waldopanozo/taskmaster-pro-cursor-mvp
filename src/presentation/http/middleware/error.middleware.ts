import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../../shared/errors/AppError';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: { message: 'Recurso no encontrado', code: 'NOT_FOUND' } });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code ?? 'APP_ERROR',
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Validación fallida',
        code: 'VALIDATION_ERROR',
        details: err.flatten(),
      },
    });
    return;
  }

  console.error('[error]', err);
  res.status(500).json({
    error: {
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
    },
  });
}
