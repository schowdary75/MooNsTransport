import { NextRequest } from 'next/server';
import { approveRefundResponse } from '@/lib/server-adapters';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = await params;
  return approveRefundResponse(resolvedParams.id);
}
