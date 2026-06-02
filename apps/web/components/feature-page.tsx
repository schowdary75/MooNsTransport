import type { ReactNode } from 'react';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';

type FeaturePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: Array<{ label: string; value: string }>;
  sections: Array<{ title: string; body: string }>;
  actions?: Array<{ label: string; href: string; variant?: 'primary' | 'secondary' | 'ghost' }>;
};

export function FeaturePage({
  eyebrow,
  title,
  description,
  highlights,
  sections,
  actions = [],
}: FeaturePageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14">
      <section className="space-y-5">
        <Badge variant="neutral">{eyebrow}</Badge>
        <div className="space-y-4">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
        </div>

        {actions.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <Button key={action.href} href={action.href} variant={action.variant ?? 'primary'}>
                {action.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {highlights.map((highlight) => (
          <Card key={highlight.label}>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-slate-500">{highlight.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {highlight.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </main>
  );
}

export function ModuleLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="text-brand-700 underline decoration-brand-300 underline-offset-4" href={href}>
      {children}
    </Link>
  );
}
