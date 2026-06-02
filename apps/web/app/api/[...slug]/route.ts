import { NextRequest, NextResponse } from 'next/server';

import {
  approveRefundResponse,
  cancelBookingResponse,
  closeSupportTicketResponse,
  createBookingResponse,
  createPaymentOrderResponse,
  createRefundResponse,
  createSavedPlaceResponse,
  createSupportTicketResponse,
  deleteAccountResponse,
  getAdminStatsResponse,
  getBookingResponse,
  getCurrentUserResponse,
  getHealthSnapshot,
  getProviderHealthSnapshot,
  getJourneyHistoryResponse,
  getRoutePlanResponse,
  getSavedPlacesResponse,
  getStopsResponse,
  getSupportTicketResponse,
  getTrackingRouteResponse,
  handlePaymentWebhookResponse,
  listAdminBookingsResponse,
  listAdminRefundsResponse,
  listAdminUsersResponse,
  listBookingsResponse,
  listPaymentsResponse,
  listSupportTicketsResponse,
  listUserRefundsResponse,
  replySupportTicketResponse,
  suspendAdminUserResponse,
  ticketDownloadResponse,
  updateCurrentUserResponse,
  updateTrackingResponse,
} from '../../../lib/server-adapters';

function notFound() {
  return NextResponse.json(
    { error: { code: 'NOT_FOUND', message: 'Unknown API route' } },
    { status: 404 }
  );
}

async function routeFor(request: NextRequest, slug: string[]) {
  const [first, second, third, fourth] = slug;
  const key = slug.join('/');

  if (slug.length === 0 || first === 'health') {
    return NextResponse.json(await getHealthSnapshot());
  }

  if (first === 'health' && second) {
    return NextResponse.json(await getProviderHealthSnapshot(second));
  }

  if (key === 'routes/plan') return getRoutePlanResponse(request);
  if (key === 'routes/stops') return getStopsResponse();

  if (key === 'user/me') {
    if (request.method === 'PUT') return updateCurrentUserResponse(request);
    return getCurrentUserResponse(request);
  }

  if (key === 'user/saved-places') {
    if (request.method === 'POST') return createSavedPlaceResponse(request);
    return getSavedPlacesResponse(request);
  }

  if (key === 'user/journey-history') return getJourneyHistoryResponse(request);

  if (key === 'bookings') {
    if (request.method === 'POST') return createBookingResponse(request);
    return listBookingsResponse(request);
  }

  if (first === 'bookings' && second && !third) {
    return getBookingResponse(request, second);
  }

  if (first === 'bookings' && second && third === 'cancel') {
    return cancelBookingResponse(request, second);
  }

  if (first === 'bookings' && second && third === 'ticket') {
    return ticketDownloadResponse(request, second);
  }

  if (key === 'payments/create-order') return createPaymentOrderResponse(request);
  if (key === 'payments/webhook') return handlePaymentWebhookResponse(request);
  if (key === 'payments/history') return listPaymentsResponse(request);
  if (key === 'payments/refund') return createRefundResponse(request);
  if (key === 'refunds') return listUserRefundsResponse(request);

  if (key === 'support/tickets') {
    if (request.method === 'POST') return createSupportTicketResponse(request);
    return listSupportTicketsResponse(request);
  }

  if (first === 'support' && second === 'tickets' && third && !fourth) {
    return getSupportTicketResponse(request, third);
  }

  if (first === 'support' && second === 'tickets' && third && fourth === 'reply') {
    return replySupportTicketResponse(request, third);
  }

  if (first === 'support' && second === 'tickets' && third && fourth === 'close') {
    return closeSupportTicketResponse(request, third);
  }

  if (key === 'tracking/update') return updateTrackingResponse(request);
  if (first === 'tracking' && second === 'route' && third) return getTrackingRouteResponse(third);

  if (key === 'admin/stats') return getAdminStatsResponse();
  if (key === 'admin/users') return listAdminUsersResponse();
  if (first === 'admin' && second === 'users' && third && fourth === 'suspend') {
    return suspendAdminUserResponse(third);
  }
  if (key === 'admin/bookings') return listAdminBookingsResponse();
  if (key === 'admin/refunds') return listAdminRefundsResponse();
  if (first === 'admin' && second === 'refunds' && third && fourth === 'approve') {
    return approveRefundResponse(third);
  }

  if (key === 'account/delete') return deleteAccountResponse();

  return notFound();
}

async function handle(request: NextRequest, context: { params: { slug?: string[] } }) {
  const slug = context.params.slug ?? [];
  return routeFor(request, slug);
}

export function GET(request: NextRequest, context: { params: { slug?: string[] } }) {
  return handle(request, context);
}

export function POST(request: NextRequest, context: { params: { slug?: string[] } }) {
  return handle(request, context);
}

export function PUT(request: NextRequest, context: { params: { slug?: string[] } }) {
  return handle(request, context);
}

export function PATCH(request: NextRequest, context: { params: { slug?: string[] } }) {
  return handle(request, context);
}

export function DELETE(request: NextRequest, context: { params: { slug?: string[] } }) {
  return handle(request, context);
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
