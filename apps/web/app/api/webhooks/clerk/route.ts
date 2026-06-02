import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { db } from '@moon/db';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is not defined');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  const body = await req.text();
  const wh = new Webhook(SIGNING_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Webhook verification failed', {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id: clerkId, email_addresses, phone_numbers, first_name, last_name, image_url } = evt.data;

    const email = email_addresses?.[0]?.email_address || null;
    const phone = phone_numbers?.[0]?.phone_number || null;

    try {
      await db.user.upsert({
        where: { clerkId },
        create: {
          clerkId,
          email,
          phone,
          name: first_name ? `${first_name} ${last_name || ''}`.trim() : null,
          avatar: image_url || null,
          role: 'USER',
          preferredLang: 'en',
        },
        update: {
          email,
          phone,
          name: first_name ? `${first_name} ${last_name || ''}`.trim() : null,
          avatar: image_url || null,
        },
      });
    } catch (error) {
      console.error('Database error:', error);
      return new Response('Error: Could not sync user', {
        status: 500,
      });
    }
  }

  if (eventType === 'user.deleted') {
    const { id: clerkId } = evt.data;

    try {
      // Soft delete or mark as inactive instead of hard delete
      await db.user.updateMany({
        where: { clerkId },
        data: {
          // Add a deleted flag if needed in schema
        },
      });
    } catch (error) {
      console.error('Database error:', error);
      return new Response('Error: Could not handle user deletion', {
        status: 500,
      });
    }
  }

  return new Response('Webhook received', { status: 200 });
}
