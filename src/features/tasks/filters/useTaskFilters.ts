import { useNavigate, useRouterState } from '@tanstack/react-router';
import type { TaskFilters } from './types';

const cleanFilters = (filters: TaskFilters): TaskFilters =>
  Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value),
  );

export function useTaskFilters() {
  const navigate = useNavigate();
  const { filters, pathname } = useRouterState({
    select: (state) => ({
      filters: cleanFilters(state.location.search),
      pathname: state.location.pathname,
    }),
  });

  const setFilters = (partial: Partial<TaskFilters>) => {
    void navigate({
      search: cleanFilters({
        ...filters,
        ...partial,
      }),
      to: pathname,
    });
  };

  return { filters, setFilters };
}
