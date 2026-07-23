import { apiRequest } from '../../lib/api';
import type { User } from '../../mocks/types';

export const getUsers = () => apiRequest<User[]>('/users');
