import { createFileRoute } from '@tanstack/react-router';
import { useActivitiesQuery } from '../features/activities';

export const Route = createFileRoute('/activity')({
  component: ActivityPage,
});

function ActivityPage() {
  const activitiesQuery = useActivitiesQuery();

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-white">Activity Feed</h2>

      {activitiesQuery.isLoading ? (
        <p className="text-sm text-zinc-400">Loading activity...</p>
      ) : null}

      {activitiesQuery.isError ? (
        <p className="text-sm text-red-300">
          Failed to load activity from mock API.
        </p>
      ) : null}

      {activitiesQuery.data ? (
        <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-200">
          {activitiesQuery.data.map((activity) => (
            <li key={activity.id}>
              {activity.createdAt} — {activity.type} — task {activity.taskId}
              {activity.payload ? (
                <pre className="mt-1 whitespace-pre-wrap text-xs text-zinc-400">
                  {JSON.stringify(activity.payload, null, 2)}
                </pre>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
