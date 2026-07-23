import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/table')({
  component: TablePage,
});

function TablePage() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white">Table</h2>
      <p className="mt-2 text-sm text-zinc-400">
        TODO: реализовать табличное представление в следующем этапе.
      </p>
    </section>
  );
}
