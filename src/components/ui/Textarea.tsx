import type { TextareaHTMLAttributes } from 'react';
import { controlClassName } from './Input';

export function Textarea({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`${controlClassName} min-h-28 resize-y ${className}`}
      {...props}
    />
  );
}
