import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@moon/db';
import { cookies } from 'next/headers';
import { demoAuthCookie, getDemoUserByRole } from './demo-auth';

function getLocalDemoUser() {
  return getDemoUserByRole(cookies().get(demoAuthCookie)?.value);
}

export async function getAuthUser() {
  const localUser = getLocalDemoUser();
  if (localUser) return localUser;

  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  return user;
}

export async function getCurrentUserId() {
  const localUser = getLocalDemoUser();
  if (localUser) return localUser.id;

  const { userId } = await auth();
  return userId;
}

export async function syncUserToDb() {
  const user = await currentUser();
  if (!user) return null;

  const dbUser = await db.user.upsert({
    where: { clerkId: user.id },
    create: {
      clerkId: user.id,
      phone: user.phoneNumbers[0]?.phoneNumber || null,
      email: user.emailAddresses[0]?.emailAddress || null,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null,
      avatar: user.imageUrl || null,
      role: 'USER',
      preferredLang: 'en',
    },
    update: {
      email: user.emailAddresses[0]?.emailAddress || null,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null,
      avatar: user.imageUrl || null,
    },
  });

  return dbUser;
}

export async function requireAuth() {
  const localUser = getLocalDemoUser();
  if (localUser) return localUser.id;

  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
}

export async function requireAdmin() {
  const localUser = getLocalDemoUser();
  if (localUser?.role === 'ADMIN') return localUser.id;

  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    throw new Error('Forbidden');
  }

  return userId;
}

export async function requireOperator() {
  const localUser = getLocalDemoUser();
  if (localUser && ['OPERATOR', 'ADMIN'].includes(localUser.role)) return localUser.id;

  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user || !['OPERATOR', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    throw new Error('Forbidden');
  }

  return userId;
}
