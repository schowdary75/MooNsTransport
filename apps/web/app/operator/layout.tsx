import { requireOperator } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function OperatorLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireOperator();
  } catch {
    redirect('/');
  }

  return <>{children}</>;
}
