import { http, HttpResponse } from 'msw';
import { activities, tasks, users } from './data';
import type { ActivityEvent, Priority, Status, Task } from './types';

const API_BASE_URL = '/api';
const PATCH_TASK_DELAY_MS = 650;
const ENABLE_PATCH_TASK_RANDOM_ERRORS = false;
const PATCH_TASK_RANDOM_ERROR_RATE = 0.1;
const SYSTEM_USER_ID = 'user-1';

const statuses: Status[] = ['todo', 'in_progress', 'done'];
const priorities: Priority[] = ['low', 'medium', 'high'];

const createActivity = (
  task: Task,
  type: ActivityEvent['type'],
  payload?: ActivityEvent['payload'],
) => {
  const activity: ActivityEvent = {
    id: crypto.randomUUID(),
    taskId: task.id,
    userId: task.assigneeId || SYSTEM_USER_ID,
    type,
    payload,
    message: `${type.replace('_', ' ')}: ${task.title}`,
    createdAt: new Date().toISOString(),
  };

  activities.unshift(activity);
};

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const handlers = [
  http.get(`${API_BASE_URL}/tasks`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');
    const assignee = url.searchParams.get('assignee');
    const search = url.searchParams.get('search');

    const filteredTasks = tasks.filter((task) => {
      const matchesStatus =
        !status ||
        (statuses.includes(status as Status) && task.status === status);
      const matchesPriority =
        !priority ||
        (priorities.includes(priority as Priority) &&
          task.priority === priority);
      const matchesAssignee = !assignee || task.assigneeId === assignee;
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      return (
        matchesStatus && matchesPriority && matchesAssignee && matchesSearch
      );
    });

    return HttpResponse.json(filteredTasks);
  }),

  http.get(`${API_BASE_URL}/tasks/:id`, ({ params }) => {
    const task = tasks.find((item) => item.id === params.id);

    if (!task) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return HttpResponse.json(task);
  }),

  http.post(`${API_BASE_URL}/tasks`, async ({ request }) => {
    const payload = (await request.json()) as Omit<
      Task,
      'id' | 'createdAt' | 'updatedAt'
    >;
    const now = new Date().toISOString();
    const task: Task = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(task);
    createActivity(task, 'created', { title: task.title });

    return HttpResponse.json(task, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/tasks/:id`, async ({ params, request }) => {
    await wait(PATCH_TASK_DELAY_MS);

    if (
      ENABLE_PATCH_TASK_RANDOM_ERRORS &&
      Math.random() < PATCH_TASK_RANDOM_ERROR_RATE
    ) {
      return HttpResponse.json(
        { message: 'Random task update failure for optimistic update demo' },
        { status: 500 },
      );
    }

    const taskIndex = tasks.findIndex((item) => item.id === params.id);

    if (taskIndex === -1) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    const payload = (await request.json()) as Partial<Task>;
    const previousTask = tasks[taskIndex];
    const updatedTask: Task = {
      ...previousTask,
      ...payload,
      id: previousTask.id,
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;

    if (payload.status && payload.status !== previousTask.status) {
      createActivity(updatedTask, 'status_changed', {
        from: previousTask.status,
        to: updatedTask.status,
      });
    }

    if (payload.assigneeId && payload.assigneeId !== previousTask.assigneeId) {
      createActivity(updatedTask, 'assignee_changed', {
        from: previousTask.assigneeId,
        to: updatedTask.assigneeId,
      });
    }

    if (payload.priority && payload.priority !== previousTask.priority) {
      createActivity(updatedTask, 'priority_changed', {
        from: previousTask.priority,
        to: updatedTask.priority,
      });
    }

    return HttpResponse.json(updatedTask);
  }),

  http.delete(`${API_BASE_URL}/tasks/:id`, ({ params }) => {
    const taskIndex = tasks.findIndex((item) => item.id === params.id);

    if (taskIndex === -1) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    tasks.splice(taskIndex, 1);
    // Activity events are kept as immutable history after task deletion.

    return HttpResponse.json({ id: params.id });
  }),

  http.get(`${API_BASE_URL}/users`, () => HttpResponse.json(users)),

  http.get(`${API_BASE_URL}/activities`, ({ request }) => {
    const url = new URL(request.url);
    const taskId = url.searchParams.get('taskId');
    const result = taskId
      ? activities.filter((activity) => activity.taskId === taskId)
      : activities;

    return HttpResponse.json(result);
  }),
];
