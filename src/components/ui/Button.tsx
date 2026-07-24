import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'bg-teal-400 text-zinc-950 hover:bg-teal-300 disabled:bg-zinc-800 disabled:text-zinc-500',
  secondary:
    'border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white disabled:border-zinc-900 disabled:text-zinc-600',
};

export function Button({
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/30 disabled:cursor-not-allowed ${variantClassNames[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
