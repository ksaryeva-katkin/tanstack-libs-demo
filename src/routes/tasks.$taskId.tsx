import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { KanbanBoard } from '../features/tasks/components/KanbanBoard';
import {
  openTaskDetail,
  useIsDetailPanelOpen,
  useSelectedTaskId,
} from '../features/tasks';

export const Route = createFileRoute('/tasks/$taskId')({
  component: TaskDetailsPage,
});

function TaskDetailsPage() {
  const { taskId } = Route.useParams();
  const selectedTaskId = useSelectedTaskId();
  const isDetailPanelOpen = useIsDetailPanelOpen();

  useEffect(() => {
    // URL and Store intentionally duplicate one bit of intent in this demo:
    // Router keeps task details shareable and browser-navigation friendly,
    // while TanStack Store drives the reactive UI state of the overlay panel.
    if (selectedTaskId !== taskId || !isDetailPanelOpen) {
      openTaskDetail(taskId);
    }
  }, [isDetailPanelOpen, selectedTaskId, taskId]);

  return <KanbanBoard />;
}
