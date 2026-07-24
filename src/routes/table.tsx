import { createFileRoute } from '@tanstack/react-router';
import { TaskFiltersBar, TaskTable, parseTaskFilters } from '../features/tasks';

export const Route = createFileRoute('/table')({
  validateSearch: parseTaskFilters,
  component: TablePage,
});

function TablePage() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium uppercase text-teal-300">
          TanStack Table
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Table</h2>
      </div>

      <TaskFiltersBar />
      <TaskTable />
    </section>
  );
}
