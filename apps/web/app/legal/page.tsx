import Link from 'next/link';

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';

import { legalPages } from '../../lib/site-data';

export default function LegalIndexPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14">
      <section className="space-y-4">
        <Badge variant="neutral">Legal</Badge>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Legal pages</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            The documentation requires a complete legal and compliance surface, and each section is
            mapped here.
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(legalPages).map(([slug, page]) => (
          <Card key={slug}>
            <CardHeader>
              <CardTitle>{page.title}</CardTitle>
              <CardDescription>{page.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                className="text-sm font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4"
                href={`/legal/${slug}`}
              >
                Open page
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
