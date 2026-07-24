import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Button, Select } from '../../../components/ui';
import { useUsersQuery } from '../../users';
import { useTasksQuery } from '../api';
import { useTaskFilters } from '../filters';
import { createTaskTableColumns } from './taskTableColumns';

const sortIndicator = {
  asc: '↑',
  desc: '↓',
} as const;

export function TaskTable() {
  const { filters } = useTaskFilters();
  const tasksQuery = useTasksQuery(filters);
  const usersQuery = useUsersQuery();
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);

  const usersById = useMemo(
    () => new Map(usersQuery.data?.map((user) => [user.id, user]) ?? []),
    [usersQuery.data],
  );

  const columns = useMemo(
    () => createTaskTableColumns({ usersById }),
    [usersById],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: tasksQuery.data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  if (tasksQuery.isLoading) {
    return (
      <div className="rounded-md border border-zinc-800 bg-zinc-900/70 px-4 py-8 text-center text-sm text-zinc-400">
        Loading tasks...
      </div>
    );
  }

  if (tasksQuery.isError) {
    return (
      <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        Failed to load tasks from mock API.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
          <thead className="bg-zinc-900/80 text-xs uppercase text-zinc-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();

                  return (
                    <th className="px-4 py-3 font-semibold" key={header.id}>
                      {header.column.getCanSort() ? (
                        <button
                          className="inline-flex items-center gap-2 text-left transition hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/30"
                          onClick={header.column.getToggleSortingHandler()}
                          type="button"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <span className="w-3 text-teal-300">
                            {sorted ? sortIndicator[sorted] : ''}
                          </span>
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {table.getRowModel().rows.map((row) => (
              <tr className="transition hover:bg-zinc-900/60" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="px-4 py-3 text-zinc-300" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getRowModel().rows.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-zinc-500">
          No tasks match these filters.
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-zinc-800 px-4 py-3 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount() || 1}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            aria-label="Rows per page"
            className="w-24"
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            value={table.getState().pagination.pageSize}
          >
            {[10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </Select>
          <Button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            type="button"
          >
            Previous
          </Button>
          <Button
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            type="button"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
