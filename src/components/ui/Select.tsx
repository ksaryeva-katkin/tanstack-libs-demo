import type { SelectHTMLAttributes } from 'react';
import { controlClassName } from './Input';

export function Select({
  className = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${controlClassName} ${className}`} {...props} />;
}
