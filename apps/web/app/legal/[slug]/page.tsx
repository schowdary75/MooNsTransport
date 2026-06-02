import { notFound } from 'next/navigation';

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';

import { getLegalPage } from '../../../lib/site-data';

type LegalPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function LegalPage({ params }: LegalPageProps) {
  const resolvedParams = await params;
  const page = getLegalPage(resolvedParams.slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14">
      <section className="space-y-4">
        <Badge variant="neutral">Legal</Badge>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{page.title}</h1>
          <p className="text-lg leading-8 text-slate-600">{page.summary}</p>
        </div>
      </section>

      <div className="grid gap-4">
        {page.content.map((paragraph) => (
          <Card key={paragraph}>
            <CardHeader>
              <CardTitle>{page.title}</CardTitle>
              <CardDescription>{paragraph}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="text-sm leading-6 text-slate-600">
          This legal surface is documentation-driven and ready for compliance copy, contact details,
          and consent mechanics.
        </CardContent>
      </Card>
    </main>
  );
}
