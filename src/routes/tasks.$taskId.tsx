import { createFileRoute } from '@tanstack/react-router';
import { useTaskQuery } from '../features/tasks';

export const Route = createFileRoute('/tasks/$taskId')({
  component: TaskDetailsPage,
});

function TaskDetailsPage() {
  const { taskId } = Route.useParams();
  const taskQuery = useTaskQuery(taskId);

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="text-xl font-semibold text-white">Task Details</h2>
      <p className="mt-2 text-sm text-zinc-400">
        TODO: реализовать панель задачи поверх доски в следующем этапе.
      </p>

      {taskQuery.isLoading ? (
        <p className="mt-6 text-sm text-zinc-400">Loading task...</p>
      ) : null}

      {taskQuery.isError ? (
        <p className="mt-6 text-sm text-red-300">Task not found.</p>
      ) : null}

      {taskQuery.data ? (
        <dl className="mt-6 grid gap-3 text-sm">
          <div>
            <dt className="text-zinc-500">Title</dt>
            <dd className="text-zinc-100">{taskQuery.data.title}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Status</dt>
            <dd className="text-zinc-100">{taskQuery.data.status}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Due date</dt>
            <dd className="text-zinc-100">{taskQuery.data.dueDate}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
