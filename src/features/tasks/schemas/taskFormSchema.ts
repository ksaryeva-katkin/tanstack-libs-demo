import { z } from 'zod';
import type { Priority, Status } from '../../../mocks/types';
import { taskPriorities, taskStatuses } from '../constants';

export const taskFormLimits = {
  titleMaxLength: 200,
  descriptionMaxLength: 2000,
};

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(
      taskFormLimits.titleMaxLength,
      `Title must be ${taskFormLimits.titleMaxLength} characters or fewer`,
    ),
  description: z
    .string()
    .max(
      taskFormLimits.descriptionMaxLength,
      `Description must be ${taskFormLimits.descriptionMaxLength} characters or fewer`,
    ),
  status: z.enum(taskStatuses),
  priority: z.enum(taskPriorities),
  assigneeId: z.string().min(1, 'Select an assignee'),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine((value) => {
      if (!value) {
        return true;
      }

      const date = new Date(`${value}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date >= today;
    }, 'Due date cannot be in the past'),
}) satisfies z.ZodType<{
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  dueDate: string;
}>;

export type TaskFormValues = z.infer<typeof taskFormSchema>;
