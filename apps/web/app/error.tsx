'use client';

import Link from 'next/link';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Something interrupted the documentation surface.</CardTitle>
          <CardDescription>
            You can retry, or return to the home screen and keep moving.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={reset}>Retry</Button>
          <Button href="/" variant="secondary">
            Home
          </Button>
          <Link
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4"
            href="/modules"
          >
            Module index
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
