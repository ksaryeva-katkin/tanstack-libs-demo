import { Link } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import type { Task, User } from '../../../mocks/types';
import { openTaskDetail } from '../store';
import { TaskPriorityBadge, TaskStatusBadge } from './TaskBadges';

const formatCreatedDate = (createdAt: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(createdAt));

type CreateTaskTableColumnsOptions = {
  usersById: Map<string, User>;
};

export const createTaskTableColumns = ({
  usersById,
}: CreateTaskTableColumnsOptions): Array<ColumnDef<Task>> => [
  {
    accessorKey: 'title',
    header: 'Task name',
    cell: ({ row }) => (
      <Link
        className="font-medium text-teal-200 underline-offset-4 hover:text-teal-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/30"
        onClick={() => openTaskDetail(row.original.id)}
        params={{ taskId: row.original.id }}
        to="/tasks/$taskId"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <TaskStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => <TaskPriorityBadge priority={row.original.priority} />,
  },
  {
    accessorKey: 'assigneeId',
    enableSorting: false,
    header: 'Assignee',
    cell: ({ row }) =>
      usersById.get(row.original.assigneeId)?.name ?? 'Unassigned',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created date',
    cell: ({ row }) => formatCreatedDate(row.original.createdAt),
  },
];
