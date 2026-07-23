import { http, HttpResponse } from 'msw';
import { activities, tasks, users } from './data';
import type { Priority, Status, Task } from './types';

const API_BASE_URL = '/api';

const statuses: Status[] = ['todo', 'in_progress', 'done'];
const priorities: Priority[] = ['low', 'medium', 'high'];

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

    return HttpResponse.json(task, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/tasks/:id`, async ({ params, request }) => {
    const taskIndex = tasks.findIndex((item) => item.id === params.id);

    if (taskIndex === -1) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    const payload = (await request.json()) as Partial<Task>;
    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...payload,
      id: tasks[taskIndex].id,
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;

    return HttpResponse.json(updatedTask);
  }),

  http.delete(`${API_BASE_URL}/tasks/:id`, ({ params }) => {
    const taskIndex = tasks.findIndex((item) => item.id === params.id);

    if (taskIndex === -1) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    tasks.splice(taskIndex, 1);

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
