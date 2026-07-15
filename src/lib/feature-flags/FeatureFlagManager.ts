interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'boolean' | 'percentage' | 'user_segment';
  value: any;
  environments: string[];
}

class FeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();

  constructor() {
    // Initialize default flags
    this.register({
      key: 'new-dashboard',
      name: 'New Dashboard',
      description: 'Enable the redesigned dashboard',
      enabled: false,
      type: 'boolean',
      value: false,
      environments: ['development', 'staging'],
    });
    this.register({
      key: 'dark-mode',
      name: 'Dark Mode',
      description: 'Enable dark mode support',
      enabled: true,
      type: 'boolean',
      value: true,
      environments: ['development', 'staging', 'production'],
    });
    this.register({
      key: 'ai-features',
      name: 'AI Features',
      description: 'Enable AI-powered features',
      enabled: false,
      type: 'user_segment',
      value: 'beta_testers',
      environments: ['development'],
    });
    this.register({
      key: 'gantt-chart',
      name: 'Gantt Chart',
      description: 'Enable Gantt chart view',
      enabled: true,
      type: 'percentage',
      value: 50,
      environments: ['development', 'staging', 'production'],
    });
  }

  register(flag: FeatureFlag): void {
    this.flags.set(flag.key, flag);
  }

  isEnabled(key: string, context?: { userId?: string; environment?: string }): boolean {
    const flag = this.flags.get(key);
    if (!flag) return false;

    const env = context?.environment || process.env.NODE_ENV || 'development';
    if (!flag.environments.includes(env)) return false;
    if (!flag.enabled) return false;

    switch (flag.type) {
      case 'boolean':
        return flag.value === true;
      case 'percentage':
        if (context?.userId) {
          const hash = this.hashCode(context.userId + key);
          return hash % 100 < flag.value;
        }
        return false;
      case 'user_segment':
        return context?.userId ? this.isInSegment(context.userId, flag.value) : false;
      default:
        return false;
    }
  }

  getFlag(key: string): FeatureFlag | undefined {
    return this.flags.get(key);
  }

  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  setEnabled(key: string, enabled: boolean): void {
    const flag = this.flags.get(key);
    if (flag) {
      flag.enabled = enabled;
    }
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private isInSegment(userId: string, segmentKey: string): boolean {
    // In production, check against database or user properties
    const segments: Record<string, string[]> = {
      beta_testers: ['user1', 'user2', 'user3'],
      enterprise: ['user4', 'user5'],
    };
    return segments[segmentKey]?.includes(userId) || false;
  }
}

export const featureFlags = new FeatureFlagManager();