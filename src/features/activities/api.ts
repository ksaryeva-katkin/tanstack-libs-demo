import { apiRequest } from '../../lib/api';
import type { ActivityEvent } from '../../mocks/types';

export const getActivities = () => apiRequest<ActivityEvent[]>('/activities');
