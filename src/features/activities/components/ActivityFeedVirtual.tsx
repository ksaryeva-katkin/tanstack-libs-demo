import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';
import type { ActivityEvent, Task, User } from '../../../mocks/types';
import { ActivityEventRow } from './ActivityEventRow';

type ActivityFeedVirtualProps = {
  activities: ActivityEvent[];
  tasksById: Map<string, Task>;
  usersById: Map<string, User>;
  onVisibleCountChange?: (count: number) => void;
};

export function ActivityFeedVirtual({
  activities,
  tasksById,
  usersById,
  onVisibleCountChange,
}: ActivityFeedVirtualProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: activities.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 112,
    overscan: 8,
  });
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    onVisibleCountChange?.(virtualItems.length);
  }, [onVisibleCountChange, virtualItems.length]);

  return (
    <div
      className="h-[680px] overflow-y-auto rounded-md border border-zinc-800 bg-black/20 p-3"
      ref={parentRef}
    >
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map((virtualItem) => {
          const activity = activities[virtualItem.index];

          return (
            <div
              className="absolute left-0 top-0 w-full pb-3"
              data-index={virtualItem.index}
              key={activity.id}
              ref={virtualizer.measureElement}
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ActivityEventRow
                activity={activity}
                task={tasksById.get(activity.taskId)}
                user={usersById.get(activity.userId)}
                usersById={usersById}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
