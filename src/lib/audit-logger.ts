export enum AuditAction {
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  PROJECT_CREATE = 'project.create',
  PROJECT_UPDATE = 'project.update',
  PROJECT_DELETE = 'project.delete',
  PROJECT_ARCHIVE = 'project.archive',
  TASK_CREATE = 'task.create',
  TASK_UPDATE = 'task.update',
  TASK_DELETE = 'task.delete',
  TASK_MOVE = 'task.move',
  TASK_ASSIGN = 'task.assign',
  TEAM_CREATE = 'team.create',
  MEMBER_ADD = 'member.add',
  MEMBER_REMOVE = 'member.remove',
  COMMENT_CREATE = 'comment.create',
  FILE_UPLOAD = 'file.upload',
  FILE_DELETE = 'file.delete',
  SETTINGS_UPDATE = 'settings.update',
  INTEGRATION_CONNECT = 'integration.connect',
}

export interface AuditEntry {
  action: AuditAction;
  userId: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
}

class AuditLogger {
  private entries: AuditEntry[] = [];

  async log(entry: Omit<AuditEntry, 'timestamp'>): Promise<void> {
    const fullEntry: AuditEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      severity: entry.severity || 'info',
    };

    this.entries.push(fullEntry);

    // In production, send to database and external service
    console.log('[AUDIT]', fullEntry.action, fullEntry.entityType, fullEntry.entityId);

    // Keep only last 1000 entries in memory
    if (this.entries.length > 1000) {
      this.entries = this.entries.slice(-1000);
    }

    // Alert on critical events
    if (entry.severity === 'critical') {
      console.error('[CRITICAL AUDIT]', fullEntry);
    }
  }

  async query(filters: {
    userId?: string;
    action?: AuditAction;
    entityType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<AuditEntry[]> {
    let results = this.entries;

    if (filters.userId) results = results.filter(e => e.userId === filters.userId);
    if (filters.action) results = results.filter(e => e.action === filters.action);
    if (filters.entityType) results = results.filter(e => e.entityType === filters.entityType);
    if (filters.startDate) results = results.filter(e => new Date(e.timestamp) >= filters.startDate!);
    if (filters.endDate) results = results.filter(e => new Date(e.timestamp) <= filters.endDate!);

    results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (filters.limit) results = results.slice(0, filters.limit);

    return results;
  }

  getRecentActivity(limit: number = 20): AuditEntry[] {
    return this.entries.slice(-limit).reverse();
  }

  clear(): void {
    this.entries = [];
  }
}

export const auditLogger = new AuditLogger();