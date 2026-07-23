import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from '../lib/query-client';
import { router } from '../lib/router';

export const App = () => (
  <RouterProvider context={{ queryClient }} router={router} />
);
