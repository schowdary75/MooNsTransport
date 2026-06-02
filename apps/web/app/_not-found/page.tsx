import Link from 'next/link';

export default function InternalNotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Moon</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
        Page unavailable
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
        The requested route could not be rendered. Return to the home page or open the module index
        to continue exploring the app.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand-500 px-5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Home
        </Link>
        <Link
          href="/modules"
          className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Modules
        </Link>
      </div>
    </main>
  );
}
