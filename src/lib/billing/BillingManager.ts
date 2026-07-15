interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    users: number;
    projects: number;
    storage: number;
    integrations: number;
    apiCalls: number;
  };
}

interface CustomerSubscription {
  id: string;
  customerId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

class BillingManager {
  private plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'For individuals and small teams',
      price: 0,
      interval: 'monthly',
      features: ['Up to 5 users', '3 projects', '1 GB storage', 'Basic integrations', 'Community support'],
      limits: { users: 5, projects: 3, storage: 1, integrations: 3, apiCalls: 1000 },
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'For growing teams',
      price: 29,
      interval: 'monthly',
      features: ['Up to 20 users', 'Unlimited projects', '10 GB storage', 'Advanced integrations', 'Priority support', 'Custom workflows', 'Advanced analytics'],
      limits: { users: 20, projects: Infinity, storage: 10, integrations: 10, apiCalls: 10000 },
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      price: 99,
      interval: 'monthly',
      features: ['Unlimited users', 'Unlimited projects', '100 GB storage', 'All integrations', 'Dedicated support', 'SSO/SAML', 'Audit logs', 'Custom branding', 'SLA guarantee'],
      limits: { users: Infinity, projects: Infinity, storage: 100, integrations: Infinity, apiCalls: 100000 },
    },
  ];

  getPlans(): SubscriptionPlan[] {
    return this.plans;
  }

  getPlan(planId: string): SubscriptionPlan | undefined {
    return this.plans.find(p => p.id === planId);
  }

  getCurrentSubscription(customerId: string): CustomerSubscription | null {
    // In production, fetch from database
    return null;
  }

  async createSubscription(customerId: string, planId: string): Promise<CustomerSubscription> {
    const plan = this.getPlan(planId);
    if (!plan) throw new Error('Invalid plan');

    // In production, create via Stripe
    return {
      id: crypto.randomUUID(),
      customerId,
      planId,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    // In production, cancel via Stripe
    console.log('Cancelling subscription:', subscriptionId);
  }

  async checkFeatureAccess(customerId: string, feature: string): Promise<boolean> {
    const subscription = this.getCurrentSubscription(customerId);
    if (!subscription) return false;
    const plan = this.getPlan(subscription.planId);
    return plan?.features.includes(feature) || false;
  }

  async checkLimit(customerId: string, limitType: keyof SubscriptionPlan['limits']): Promise<{ allowed: boolean; current: number; max: number }> {
    const subscription = this.getCurrentSubscription(customerId);
    if (!subscription) return { allowed: false, current: 0, max: 0 };
    const plan = this.getPlan(subscription.planId);
    if (!plan) return { allowed: false, current: 0, max: 0 };
    const current = 0; // Get from database
    return { allowed: current < plan.limits[limitType], current, max: plan.limits[limitType] };
  }
}

export const billingManager = new BillingManager();