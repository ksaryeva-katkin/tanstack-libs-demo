import { z } from 'zod';
import type { Priority, Status } from '../../../mocks/types';
import { taskPriorities, taskStatuses } from '../constants';

export const taskFormLimits = {
  titleMaxLength: 200,
  descriptionMaxLength: 2000,
};

export const taskFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Название обязательно')
      .max(
        taskFormLimits.titleMaxLength,
        `Название должно быть не длиннее ${taskFormLimits.titleMaxLength} символов`,
      ),
    description: z
      .string()
      .max(
        taskFormLimits.descriptionMaxLength,
        `Описание должно быть не длиннее ${taskFormLimits.descriptionMaxLength} символов`,
      ),
    status: z.enum(taskStatuses),
    priority: z.enum(taskPriorities),
    assigneeId: z.string().min(1, 'Выберите исполнителя'),
    dueDate: z.string().refine((value) => {
      if (!value) {
        return true;
      }

      const date = new Date(`${value}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date >= today;
    }, 'Срок выполнения не может быть в прошлом'),
  })
  .superRefine((value, context) => {
    if (value.priority === 'high' && !value.dueDate) {
      context.addIssue({
        code: 'custom',
        message: 'Для высокого приоритета укажите срок выполнения',
        path: ['dueDate'],
      });
    }
  }) satisfies z.ZodType<{
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  dueDate: string;
}>;

export type TaskFormValues = z.infer<typeof taskFormSchema>;
