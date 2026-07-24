import type { ActivityEvent, Task, User } from '../../../mocks/types';
import { ActivityEventRow } from './ActivityEventRow';

type ActivityFeedPlainProps = {
  activities: ActivityEvent[];
  tasksById: Map<string, Task>;
  usersById: Map<string, User>;
};

export function ActivityFeedPlain({
  activities,
  tasksById,
  usersById,
}: ActivityFeedPlainProps) {
  return (
    <div className="h-[680px] overflow-y-auto rounded-md border border-zinc-800 bg-black/20 p-3">
      <div className="space-y-3">
        {activities.map((activity) => (
          <ActivityEventRow
            activity={activity}
            key={activity.id}
            task={tasksById.get(activity.taskId)}
            user={usersById.get(activity.userId)}
            usersById={usersById}
          />
        ))}
      </div>
    </div>
  );
}
