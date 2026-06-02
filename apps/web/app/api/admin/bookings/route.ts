import { listAdminBookingsResponse } from '@/lib/server-adapters';

export async function GET() {
  return listAdminBookingsResponse();
}
