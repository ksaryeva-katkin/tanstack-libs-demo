import type { InputHTMLAttributes } from 'react';

export const controlClassName =
  'w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-300/20 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-500';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${controlClassName} ${className}`} {...props} />;
}
