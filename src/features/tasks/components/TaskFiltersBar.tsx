import { useDebouncer } from '@tanstack/react-pacer';
import { useMemo, useState } from 'react';
import { Input, Select } from '../../../components/ui';
import { useUsersQuery } from '../../users';
import {
  taskPriorities,
  taskPriorityLabels,
  taskStatuses,
  taskStatusLabels,
} from '../constants';
import { useTaskFilters } from '../filters';
import type { Priority, Status } from '../../../mocks/types';

export function TaskFiltersBar() {
  const { filters, setFilters } = useTaskFilters();
  const usersQuery = useUsersQuery();
  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
  const currentSearch = filters.search ?? '';
  const [searchInput, setSearchInput] = useState({
    searchFromUrl: currentSearch,
    text: currentSearch,
  });

  if (searchInput.searchFromUrl !== currentSearch) {
    setSearchInput({
      searchFromUrl: currentSearch,
      text: currentSearch,
    });
  }

  const searchDebouncer = useDebouncer(
    (search: string) => {
      setFilters({ search: search || undefined });
    },
    // Debounce fits search because only the final value after a typing pause
    // should update the URL and trigger a task query.
    { key: 'task-filters-search-debouncer', wait: 350 },
    (state) => ({ isPending: state.isPending }),
  );

  return (
    <div className="grid gap-3 rounded-md border border-zinc-800 bg-zinc-900/70 p-4 md:grid-cols-[minmax(12rem,1fr)_11rem_11rem_14rem]">
      <label className="flex flex-col gap-1 text-xs font-medium uppercase text-zinc-500">
        <span className="flex items-center justify-between gap-3">
          <span>Search</span>
          {searchDebouncer.state.isPending ? (
            <span className="text-[0.7rem] normal-case text-teal-200">
              Searching...
            </span>
          ) : null}
        </span>
        <Input
          onChange={(event) => {
            const nextSearch = event.target.value;
            setSearchInput({
              searchFromUrl: currentSearch,
              text: nextSearch,
            });
            searchDebouncer.maybeExecute(nextSearch);
          }}
          placeholder="Task name or description"
          value={searchInput.text}
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium uppercase text-zinc-500">
        Status
        <Select
          onChange={(event) =>
            setFilters({ status: (event.target.value || undefined) as Status })
          }
          value={filters.status ?? ''}
        >
          <option value="">All statuses</option>
          {taskStatuses.map((status) => (
            <option key={status} value={status}>
              {taskStatusLabels[status]}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium uppercase text-zinc-500">
        Priority
        <Select
          onChange={(event) =>
            setFilters({
              priority: (event.target.value || undefined) as Priority,
            })
          }
          value={filters.priority ?? ''}
        >
          <option value="">All priorities</option>
          {taskPriorities.map((priority) => (
            <option key={priority} value={priority}>
              {taskPriorityLabels[priority]}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium uppercase text-zinc-500">
        Assignee
        <Select
          disabled={usersQuery.isLoading}
          onChange={(event) =>
            setFilters({ assignee: event.target.value || undefined })
          }
          value={filters.assignee ?? ''}
        >
          <option value="">All assignees</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}
