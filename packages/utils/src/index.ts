// Shared utility functions used across the web app and future services.

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatDistanceKm(distance: number): string {
  if (!Number.isFinite(distance)) return '0m';
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

export function formatDuration(minutes: number): string {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

export function formatDurationVerbose(minutes: number): string {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;

  const hourPart = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '';
  const minutePart = mins > 0 ? `${mins} ${mins === 1 ? 'minute' : 'minutes'}` : '';

  if (hourPart && minutePart) return `${hourPart} ${minutePart}`;
  return hourPart || minutePart || '0 minutes';
}

export function formatPrice(priceInRupees: number): string {
  return `Rs. ${priceInRupees.toLocaleString('en-IN')}`;
}

export function formatCurrency(
  amount: number,
  currency = 'INR',
  locale = 'en-IN',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatRelativeDate(date: Date, baseDate = new Date()): string {
  const diffMs = date.getTime() - baseDate.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (Math.abs(diffMinutes) < 1) return 'just now';
  if (Math.abs(diffMinutes) < 60) {
    return diffMinutes > 0
      ? `in ${diffMinutes} min`
      : `${Math.abs(diffMinutes)} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `in ${diffHours}h` : `${Math.abs(diffHours)}h ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return diffDays > 0 ? `in ${diffDays}d` : `${Math.abs(diffDays)}d ago`;
}

export function isValidPhone(phone: string): boolean {
  const indianPhoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return indianPhoneRegex.test(phone.replace(/\s+/g, ''));
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const lastTen = cleaned.slice(-10);
  if (lastTen.length < 10) {
    return phone;
  }
  return `+91 ${lastTen.slice(0, 5)} ${lastTen.slice(5)}`;
}

export function uniqueValues<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export function groupBy<T, K extends string | number | symbol>(
  items: T[],
  keySelector: (item: T) => K,
): Record<K, T[]> {
  return items.reduce<Record<K, T[]>>((groups, item) => {
    const key = keySelector(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}
