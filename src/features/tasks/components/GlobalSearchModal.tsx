import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTasksCollectionQuery } from '../collections';
import { openTaskDetail } from '../store';
import { TaskPriorityBadge, TaskStatusBadge } from './TaskBadges';

type GlobalSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const tasksQuery = useTasksCollectionQuery();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const tasks = tasksQuery.data ?? [];

    if (!normalizedQuery) {
      return tasks.slice(0, 8);
    }

    return tasks
      .filter((task) => task.title.toLowerCase().includes(normalizedQuery))
      .slice(0, 8);
  }, [query, tasksQuery.data]);
  const activeResultIndex = Math.min(
    activeIndex,
    Math.max(results.length - 1, 0),
  );

  useEffect(() => {
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  if (!isOpen) {
    return null;
  }

  const selectTask = (taskId: string) => {
    onClose();
    openTaskDetail(taskId);
    void navigate({
      params: { taskId },
      to: '/tasks/$taskId',
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/65 px-4 pt-24">
      <button
        aria-label="Close global search"
        className="absolute inset-0"
        onClick={onClose}
        type="button"
      />

      <div
        aria-label="Global task search"
        aria-modal="true"
        className="relative w-full max-w-2xl overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50"
        role="dialog"
      >
        <div className="border-b border-zinc-800 p-4">
          <input
            ref={inputRef}
            aria-activedescendant={
              results[activeResultIndex]
                ? `global-search-${results[activeResultIndex].id}`
                : undefined
            }
            aria-controls="global-search-results"
            aria-label="Search tasks"
            className="w-full bg-transparent text-lg font-medium text-white outline-none placeholder:text-zinc-500"
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActiveIndex((index) =>
                  results.length === 0 ? 0 : (index + 1) % results.length,
                );
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActiveIndex((index) =>
                  results.length === 0
                    ? 0
                    : (index - 1 + results.length) % results.length,
                );
              }

              if (event.key === 'Enter') {
                event.preventDefault();
                const task = results[activeResultIndex];

                if (task) {
                  selectTask(task.id);
                }
              }
            }}
            placeholder="Search tasks..."
            value={query}
          />
        </div>

        <div
          className="max-h-80 overflow-y-auto p-2"
          id="global-search-results"
          role="listbox"
        >
          {tasksQuery.isLoading ? (
            <p className="px-3 py-8 text-center text-sm text-zinc-500">
              Loading tasks...
            </p>
          ) : null}

          {!tasksQuery.isLoading && results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-zinc-500">
              No results found
            </p>
          ) : null}

          {results.map((task, index) => (
            <button
              aria-selected={index === activeIndex}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition ${
                index === activeIndex
                  ? 'bg-teal-400/10 text-white'
                  : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
              }`}
              id={`global-search-${task.id}`}
              key={task.id}
              onClick={() => selectTask(task.id)}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
              type="button"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {task.title}
              </span>
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
