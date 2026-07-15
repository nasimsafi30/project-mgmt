export enum Permission {
  VIEW_PROJECT = 'view:project',
  CREATE_PROJECT = 'create:project',
  EDIT_PROJECT = 'edit:project',
  DELETE_PROJECT = 'delete:project',
  VIEW_TASK = 'view:task',
  CREATE_TASK = 'create:task',
  EDIT_TASK = 'edit:task',
  DELETE_TASK = 'delete:task',
  ASSIGN_TASK = 'assign:task',
  VIEW_TEAM = 'view:team',
  MANAGE_TEAM = 'manage:team',
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_SETTINGS = 'manage:settings',
  MANAGE_INTEGRATIONS = 'manage:integrations',
  MANAGE_BILLING = 'manage:billing',
}

export enum Role {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.OWNER]: Object.values(Permission),
  [Role.ADMIN]: [
    Permission.VIEW_PROJECT, Permission.CREATE_PROJECT, Permission.EDIT_PROJECT, Permission.DELETE_PROJECT,
    Permission.VIEW_TASK, Permission.CREATE_TASK, Permission.EDIT_TASK, Permission.DELETE_TASK, Permission.ASSIGN_TASK,
    Permission.VIEW_TEAM, Permission.MANAGE_TEAM,
    Permission.VIEW_ANALYTICS, Permission.MANAGE_SETTINGS, Permission.MANAGE_INTEGRATIONS,
  ],
  [Role.MEMBER]: [
    Permission.VIEW_PROJECT, Permission.CREATE_PROJECT,
    Permission.VIEW_TASK, Permission.CREATE_TASK, Permission.EDIT_TASK, Permission.ASSIGN_TASK,
    Permission.VIEW_TEAM,
    Permission.VIEW_ANALYTICS,
  ],
  [Role.VIEWER]: [
    Permission.VIEW_PROJECT, Permission.VIEW_TASK, Permission.VIEW_TEAM,
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}

export function getPermissionsForRole(role: Role): Permission[] {
  return rolePermissions[role] || [];
}

export function getRoleHierarchy(role: Role): number {
  const hierarchy: Record<Role, number> = {
    [Role.OWNER]: 4,
    [Role.ADMIN]: 3,
    [Role.MEMBER]: 2,
    [Role.VIEWER]: 1,
  };
  return hierarchy[role] || 0;
}

export function canManageRole(currentRole: Role, targetRole: Role): boolean {
  return getRoleHierarchy(currentRole) > getRoleHierarchy(targetRole);
}