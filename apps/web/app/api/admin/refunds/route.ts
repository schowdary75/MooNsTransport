import { listAdminRefundsResponse } from '@/lib/server-adapters';

export async function GET() {
  return listAdminRefundsResponse();
}
