interface WorkflowTrigger {
  type: 'task_created' | 'task_updated' | 'task_moved' | 'task_completed' | 'comment_added' | 'sprint_started' | 'due_date_approaching';
  conditions?: Array<{ field: string; operator: string; value: any }>;
}

interface WorkflowAction {
  type: 'assign_task' | 'change_status' | 'change_priority' | 'add_label' | 'send_notification' | 'create_task' | 'send_email' | 'webhook';
  config: Record<string, any>;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  projectId?: string;
  runCount: number;
}

class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();

  register(workflow: Omit<Workflow, 'id' | 'runCount'>): Workflow {
    const id = crypto.randomUUID();
    const newWorkflow: Workflow = { ...workflow, id, runCount: 0 };
    this.workflows.set(id, newWorkflow);
    return newWorkflow;
  }

  unregister(id: string): boolean {
    return this.workflows.delete(id);
  }

  getWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  async execute(event: WorkflowTrigger['type'], context: Record<string, any>): Promise<void> {
    const matching = Array.from(this.workflows.values())
      .filter(w => w.enabled && w.trigger.type === event);

    for (const workflow of matching) {
      if (this.checkConditions(workflow.trigger.conditions || [], context)) {
        for (const action of workflow.actions) {
          await this.executeAction(action, context);
        }
        workflow.runCount++;
      }
    }
  }

  private checkConditions(conditions: WorkflowTrigger['conditions'], context: Record<string, any>): boolean {
    if (!conditions?.length) return true;

    return conditions.every(condition => {
      const value = context[condition.field];
      switch (condition.operator) {
        case 'equals': return value === condition.value;
        case 'not_equals': return value !== condition.value;
        case 'contains': return String(value).includes(String(condition.value));
        case 'greater_than': return Number(value) > Number(condition.value);
        case 'less_than': return Number(value) < Number(condition.value);
        case 'in': return Array.isArray(condition.value) && condition.value.includes(value);
        default: return false;
      }
    });
  }

  private async executeAction(action: WorkflowAction, context: Record<string, any>): Promise<void> {
    switch (action.type) {
      case 'assign_task':
        console.log('Assigning task:', action.config);
        break;
      case 'change_status':
        console.log('Changing status:', action.config);
        break;
      case 'send_notification':
        console.log('Sending notification:', action.config);
        break;
      case 'send_email':
        console.log('Sending email:', action.config);
        break;
      case 'webhook':
        try {
          await fetch(action.config.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...context, timestamp: new Date().toISOString() }),
          });
        } catch (error) {
          console.error('Webhook failed:', error);
        }
        break;
    }
  }
}

export const workflowEngine = new WorkflowEngine();

// Pre-built templates
export const workflowTemplates = [
  {
    name: 'Auto-assign bugs',
    trigger: { type: 'task_created', conditions: [{ field: 'labels', operator: 'contains', value: 'bug' }] },
    actions: [
      { type: 'change_priority', config: { priority: 'high' } },
      { type: 'send_notification', config: { title: 'New Bug', message: 'A new bug has been reported' } },
    ],
  },
  {
    name: 'Sprint start notification',
    trigger: { type: 'sprint_started' },
    actions: [
      { type: 'send_notification', config: { title: 'Sprint Started', message: 'The sprint has begun!' } },
    ],
  },
];