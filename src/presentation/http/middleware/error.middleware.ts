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

  // express.json() / body-parser: JSON inválido (p. ej. `-d "{\\"title\\"..."` mal escapado en PowerShell)
  const bodyParseErr = err as { status?: number; type?: string };
  if (bodyParseErr.status === 400 && bodyParseErr.type === 'entity.parse.failed') {
    res.status(400).json({
      error: {
        message:
          'El cuerpo no es JSON válido. En PowerShell no uses comillas escapadas dentro de -d: usá un fichero (--data-binary @body.json), Invoke-RestMethod, o curl.exe desde cmd.exe.',
        code: 'INVALID_JSON',
      },
    });
    return;
  }

  console.error('[error]', err);
  const isProd = process.env.NODE_ENV === 'production';
  const devDetail =
    !isProd && err instanceof Error ? err.message : undefined;
  res.status(500).json({
    error: {
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
      ...(devDetail ? { details: devDetail } : {}),
    },
  });
}
