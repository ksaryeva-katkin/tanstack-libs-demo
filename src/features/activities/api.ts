import { apiRequest, toSearchParams } from '../../lib/api';
import type { ActivityEvent } from '../../mocks/types';
import type { ActivityFilters } from './queryKeys';

export const getActivities = (filters: ActivityFilters = {}) =>
  apiRequest<ActivityEvent[]>(`/activities${toSearchParams(filters)}`);
