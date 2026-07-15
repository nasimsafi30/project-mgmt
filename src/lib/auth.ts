import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const session = await auth();
  return session?.userId || null;
}

export async function requireAuth() {
  const userId = await getCurrentUser();
  if (!userId) {
    redirect('/sign-in');
  }
  return userId;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.userId;
}

export function getUserRole(): string {
  // Get from session claims or database
  return 'member';
}

export function hasPermission(permission: string): boolean {
  const role = getUserRole();
  const permissions: Record<string, string[]> = {
    owner: ['*'],
    admin: ['read:*', 'write:*', 'delete:*', 'manage:team', 'manage:settings'],
    member: ['read:*', 'write:tasks', 'write:comments'],
    viewer: ['read:*'],
  };
  const userPermissions = permissions[role] || [];
  return userPermissions.includes('*') || userPermissions.includes(permission);
}
