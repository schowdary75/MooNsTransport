'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function Select({
  children,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return <>{children}</>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectItem({ children }: { value: string; children: React.ReactNode }) {
  return <option>{children}</option>;
}

export function SelectTrigger({
  className,
  id,
  children,
}: {
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return <div id={id} className={cn('rounded-lg border border-slate-300 px-3 py-2', className)}>{children}</div>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span>{placeholder}</span>;
}
