export type Status = 'todo' | 'in_progress' | 'done';

export type Priority = 'low' | 'medium' | 'high';

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  createdAt: string;
  dueDate: string;
  updatedAt: string;
};

export type ActivityEvent = {
  id: string;
  taskId: string;
  userId: string;
  type: 'created' | 'status_changed' | 'assignee_changed' | 'priority_changed';
  payload?: Record<string, unknown>;
  message: string;
  createdAt: string;
};
