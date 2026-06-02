'use client';

import { useRouter } from 'next/navigation';
import { Building2, ShieldCheck, UserCircle2 } from 'lucide-react';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@moon/ui';
import { Button } from '@/components/ui/button';
import { demoUsers, type DemoRole } from '@/lib/demo-auth';
import { useLocalAuth } from '@/hooks/use-local-auth';

const roleIcons = {
  RIDER: UserCircle2,
  ADMIN: ShieldCheck,
  OPERATOR: Building2,
};

const roleCopy = {
  RIDER: 'Plan journeys, view live tracking, and manage saved places.',
  ADMIN: 'Open operations dashboards, KPIs, and support-style controls.',
  OPERATOR: 'Manage fleet context, routes, schedules, and service health.',
};

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useLocalAuth();

  function handleLogin(role: DemoRole) {
    signIn(role);
    window.location.href = role === 'ADMIN' ? '/admin' : role === 'OPERATOR' ? '/operator' : '/routes';
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <section className="space-y-3">
        <Badge variant="neutral">Local demo login</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Choose a test account and start the full Moon demo locally.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          These accounts are seeded for local development and do not require Clerk, SMS, or email
          provider keys.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {demoUsers.map((user) => {
          const Icon = roleIcons[user.role];
          return (
            <Card key={user.role}>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500/10 text-brand-700">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{roleCopy[user.role]}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-slate-50 p-4 text-sm">
                  <p className="font-semibold text-slate-950">{user.email}</p>
                  <p className="text-slate-500">Password: {user.password}</p>
                </div>
                <Button className="w-full" onClick={() => handleLogin(user.role)}>
                  Continue as {user.role.toLowerCase()}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
