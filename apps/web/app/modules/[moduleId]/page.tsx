import { redirect, notFound } from 'next/navigation';
import { getModule } from '../../../lib/site-data';

type ModulePageProps = {
  params: Promise<{ moduleId: string }> | { moduleId: string };
};

export default async function ModulePage({ params }: ModulePageProps) {
  const resolvedParams = await params;
  const moduleInfo = getModule(resolvedParams.moduleId);

  if (!moduleInfo) {
    notFound();
  }

  // Redirect to main modules roadmap dashboard with the id query parameter to open the drawer
  redirect(`/modules?id=${encodeURIComponent(resolvedParams.moduleId)}`);
}
