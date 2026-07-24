import type { ActivityEvent, Priority, Status, Task, User } from './types';

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Maya Chen',
    email: 'maya@example.com',
    avatarUrl: 'https://i.pravatar.cc/120?img=5',
  },
  {
    id: 'user-2',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    avatarUrl: 'https://i.pravatar.cc/120?img=12',
  },
  {
    id: 'user-3',
    name: 'Nina Patel',
    email: 'nina@example.com',
    avatarUrl: 'https://i.pravatar.cc/120?img=32',
  },
  {
    id: 'user-4',
    name: 'Owen Brooks',
    email: 'owen@example.com',
    avatarUrl: 'https://i.pravatar.cc/120?img=48',
  },
  {
    id: 'user-5',
    name: 'Sofia Rivera',
    email: 'sofia@example.com',
    avatarUrl: 'https://i.pravatar.cc/120?img=25',
  },
];

const statuses: Status[] = ['todo', 'in_progress', 'done'];
const priorities: Priority[] = ['low', 'medium', 'high'];

const taskTitles = [
  'Define board columns',
  'Prepare mock API layer',
  'Create routing layout',
  'Wire query client provider',
  'Draft task details panel',
  'Add table placeholder',
  'Add activity placeholder',
  'Document local scripts',
  'Review task status model',
  'Seed realistic users',
  'Prepare activity fixtures',
  'Add board search schema',
  'Test MSW worker startup',
  'Create API request helper',
  'Add create mutation hook',
  'Add update mutation hook',
  'Add delete mutation hook',
  'Normalize due date format',
  'Check responsive shell',
  'Verify production build',
  'Add route tree generation',
  'Prepare next stage notes',
  'Map future table columns',
  'Sketch activity event types',
];

export const tasks: Task[] = taskTitles.map((title, index) => {
  const createdDay = 1 + (index % 20);
  const dueDay = createdDay + 7;

  return {
    id: `${index + 1}`,
    title,
    description: `${title} for the Mini Kanban Board foundation stage.`,
    status: statuses[index % statuses.length],
    priority: priorities[index % priorities.length],
    assigneeId: users[index % users.length].id,
    createdAt: `2026-07-${String(createdDay).padStart(2, '0')}T09:00:00.000Z`,
    dueDate: `2026-08-${String(dueDay).padStart(2, '0')}`,
    updatedAt: `2026-07-${String(createdDay).padStart(2, '0')}T12:30:00.000Z`,
  };
});

const eventTypes: ActivityEvent['type'][] = [
  'created',
  'status_changed',
  'assignee_changed',
  'priority_changed',
];

const activityCount = 2400;
const activityStartDate = new Date('2026-03-10T08:00:00.000Z');
const activityEndDate = new Date('2026-07-24T15:30:00.000Z');
const activityDateRangeMs =
  activityEndDate.getTime() - activityStartDate.getTime();

const getPreviousValue = (type: ActivityEvent['type'], index: number) => {
  if (type === 'status_changed') {
    return statuses[(index + 1) % statuses.length];
  }

  if (type === 'priority_changed') {
    return priorities[(index + 2) % priorities.length];
  }

  if (type === 'assignee_changed') {
    return users[(index + 3) % users.length].id;
  }

  return undefined;
};

const createActivityPayload = (
  type: ActivityEvent['type'],
  task: Task,
  index: number,
): ActivityEvent['payload'] => {
  if (type === 'created') {
    return { title: task.title };
  }

  return {
    from: getPreviousValue(type, index),
    to:
      type === 'status_changed'
        ? task.status
        : type === 'priority_changed'
          ? task.priority
          : task.assigneeId,
  };
};

export const activities: ActivityEvent[] = Array.from(
  { length: activityCount },
  (_, index) => {
    const task = tasks[(index * 7) % tasks.length];
    const user = users[(index * 3) % users.length];
    const type = eventTypes[index % eventTypes.length];
    const createdAt = new Date(
      activityEndDate.getTime() -
        Math.round((activityDateRangeMs * index) / activityCount) -
        (index % 37) * 41_000,
    ).toISOString();

    return {
      id: `${index + 1}`,
      taskId: task.id,
      userId: user.id,
      type,
      payload: createActivityPayload(type, task, index),
      message: `${user.name} ${type.replace('_', ' ')} ${task.title}`,
      createdAt,
    };
  },
);
