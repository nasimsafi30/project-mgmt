// Auth helpers - using custom auth (localStorage based)

export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }
  return user;
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}

export function getUserRole(): string {
  const user = getCurrentUser();
  return user?.role || 'member';
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
