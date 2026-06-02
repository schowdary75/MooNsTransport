import { listAdminUsersResponse } from '@/lib/server-adapters';

export async function GET() {
  return listAdminUsersResponse();
}
