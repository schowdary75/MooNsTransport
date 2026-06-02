import { notFound } from 'next/navigation';

import { FeaturePage } from '../../components/feature-page';
import { getFeaturePage } from '../../lib/site-data';

type SlugPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function SlugPage({ params }: SlugPageProps) {
  const resolvedParams = await params;
  const page = getFeaturePage(resolvedParams.slug);

  if (!page) {
    notFound();
  }

  return (
    <FeaturePage
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      highlights={page.highlights}
      sections={page.sections}
      actions={[{ label: 'Open module index', href: '/modules', variant: 'secondary' }]}
    />
  );
}
