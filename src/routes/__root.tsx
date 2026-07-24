import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { AppProviders } from '../app/AppProviders';
import { TaskDetailPanel } from '../features/tasks/components/TaskDetailPanel';
import { parseTaskFilters } from '../features/tasks';

type RouterContext = {
  queryClient: QueryClient;
};

const navigation = [
  { to: '/board', label: 'Board' },
  { to: '/table', label: 'Table' },
  { to: '/activity', label: 'Activity' },
] as const;

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  const taskFilters = useRouterState({
    select: (state) => parseTaskFilters(state.location.search),
  });

  return (
    <AppProviders>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <header className="border-b border-zinc-800 bg-zinc-950/95">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-teal-300">
                TanStack ecosystem demo
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-white">
                Mini Kanban Board
              </h1>
            </div>

            <nav className="flex flex-wrap gap-2">
              {navigation.map((item) => (
                <Link
                  activeProps={{
                    className: 'border-teal-400 bg-teal-400/10 text-teal-100',
                  }}
                  className="rounded-md border border-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                  key={item.to}
                  search={
                    item.to === '/board' || item.to === '/table'
                      ? taskFilters
                      : undefined
                  }
                  to={item.to}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">
          <Outlet />
        </main>
        <TaskDetailPanel />
      </div>
    </AppProviders>
  );
}
