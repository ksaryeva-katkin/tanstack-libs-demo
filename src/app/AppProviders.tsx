import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { queryClient } from '../lib/query-client';
import { TanStackDevtools } from './TanStackDevtools';

export const AppProviders = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <TanStackDevtools />
  </QueryClientProvider>
);
