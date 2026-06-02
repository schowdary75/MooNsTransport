import { getAdminStatsResponse } from '@/lib/server-adapters';

export async function GET() {
  return getAdminStatsResponse();
}
