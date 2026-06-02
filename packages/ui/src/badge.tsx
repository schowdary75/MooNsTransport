import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from './utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'neutral';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-brand-500/15 text-brand-700 ring-brand-500/20',
  success: 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-700 ring-amber-500/20',
  neutral: 'bg-slate-500/10 text-slate-700 ring-slate-500/15',
};

export function Badge({ children, className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ring-inset',
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
