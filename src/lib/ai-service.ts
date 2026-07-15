interface TaskBreakdown {
  title: string;
  subtasks: Array<{ title: string; estimatedHours: number }>;
  risks: string[];
  recommendations: string[];
}

interface TaskEstimate {
  complexity: 'low' | 'medium' | 'high' | 'very_high';
  estimatedHours: { min: number; max: number; mostLikely: number };
  confidence: number;
}

class AIService {
  private enabled: boolean;

  constructor() {
    this.enabled = !!process.env.OPENAI_API_KEY;
  }

  async breakDownTask(description: string): Promise<TaskBreakdown> {
    if (!this.enabled) {
      return {
        title: description,
        subtasks: [
          { title: 'Research and planning', estimatedHours: 2 },
          { title: 'Implementation', estimatedHours: 4 },
          { title: 'Testing and review', estimatedHours: 2 },
        ],
        risks: ['Scope creep', 'Technical complexity'],
        recommendations: ['Break down further if needed', 'Assign to experienced team member'],
      };
    }

    // In production, call OpenAI API
    // const completion = await openai.chat.completions.create({...});
    return {
      title: description,
      subtasks: [],
      risks: [],
      recommendations: [],
    };
  }

  async estimateTask(description: string): Promise<TaskEstimate> {
    const wordCount = description.split(' ').length;

    if (wordCount < 5) {
      return { complexity: 'low', estimatedHours: { min: 1, max: 4, mostLikely: 2 }, confidence: 0.7 };
    } else if (wordCount < 15) {
      return { complexity: 'medium', estimatedHours: { min: 4, max: 16, mostLikely: 8 }, confidence: 0.6 };
    } else {
      return { complexity: 'high', estimatedHours: { min: 16, max: 40, mostLikely: 24 }, confidence: 0.5 };
    }
  }

  async suggestAssignee(task: { title: string; description: string }, members: Array<{ id: string; name: string; skills: string[]; workload: number }>) {
    // Simple heuristic: find member with lowest workload and matching skills
    const sorted = members.sort((a, b) => a.workload - b.workload);
    return sorted.slice(0, 3).map(m => ({
      userId: m.id,
      userName: m.name,
      score: Math.round((1 - m.workload / 100) * 100),
      reason: 'Low workload',
    }));
  }

  async analyzeRisks(projectData: { tasks: any[]; timeline: { start: Date; end: Date } }) {
    const risks = [];
    if (projectData.tasks.length > 20) risks.push({ risk: 'High task volume', probability: 0.6, impact: 0.5, severity: 'medium' });
    if (projectData.tasks.filter((t: any) => t.status === 'backlog').length > 10) risks.push({ risk: 'Backlog buildup', probability: 0.7, impact: 0.6, severity: 'high' });
    return risks;
  }
}

export const aiService = new AIService();