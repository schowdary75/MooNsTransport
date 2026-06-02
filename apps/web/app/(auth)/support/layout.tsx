import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SupportLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAuth();
  } catch {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
