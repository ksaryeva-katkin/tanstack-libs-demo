export type ActivityFilters = {
  limit?: number;
  offset?: number;
  taskId?: string;
};

export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (filters: ActivityFilters = {}) =>
    [...activityKeys.lists(), filters] as const,
};
