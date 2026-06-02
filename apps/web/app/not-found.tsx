import Link from 'next/link';

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-8">
      <Card className="w-full">
        <CardHeader>
          <Badge variant="neutral">Not found</Badge>
          <CardTitle>This route is not in the documentation surface.</CardTitle>
          <CardDescription>
            Try the module index or one of the mapped feature routes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button href="/modules">Open modules</Button>
          <Button href="/" variant="secondary">
            Back home
          </Button>
          <Link
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4"
            href="/routes"
          >
            Route planner
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
