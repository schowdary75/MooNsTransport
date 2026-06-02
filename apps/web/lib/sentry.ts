export function captureException(error: any, extraContext: Record<string, any> = {}) {
  console.error('[Sentry Capture Exception]:', error, 'Context:', extraContext);
  // In production with real DSN, we would call:
  // import * as Sentry from "@sentry/nextjs";
  // Sentry.captureException(error, { extra: extraContext });
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  console.log(`[Sentry Capture Message - ${level.toUpperCase()}]:`, message);
}
