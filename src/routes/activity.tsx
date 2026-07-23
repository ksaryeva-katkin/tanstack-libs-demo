import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/activity')({
  component: ActivityPage,
});

function ActivityPage() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white">Activity Feed</h2>
      <p className="mt-2 text-sm text-zinc-400">
        TODO: реализовать Activity Feed в следующем этапе.
      </p>
    </section>
  );
}
