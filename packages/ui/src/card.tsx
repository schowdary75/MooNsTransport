import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from './utils';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

type CardTextProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-200/70 bg-white/85 shadow-[0_18px_60px_-24px_rgba(15,23,42,0.24)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardTextProps) {
  return (
    <div className={cn('flex flex-col gap-2 p-6 pb-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardTextProps) {
  return (
    <h3 className={cn('text-lg font-semibold tracking-tight text-slate-950 dark:text-white', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: CardTextProps) {
  return (
    <p className={cn('text-sm leading-6 text-slate-600 dark:text-slate-400', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: CardTextProps) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardTextProps) {
  return (
    <div className={cn('flex items-center justify-between gap-4 border-t border-slate-200/70 p-6 pt-4 dark:border-slate-800', className)} {...props}>
      {children}
    </div>
  );
}
