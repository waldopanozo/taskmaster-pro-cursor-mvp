/**
 * Tipos de dominio para tareas (independientes del ORM).
 */
export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: Date;
}
