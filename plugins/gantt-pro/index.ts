// Gantt Chart Pro Plugin
import { PluginContext } from '@/lib/plugin-system/PluginManager';

export async function activate(context: PluginContext) {
  console.log('[Gantt Pro] Plugin activated');

  // Register enhanced Gantt component
  context.api.registerComponent('GanttPro', {
    name: 'GanttPro',
    description: 'Advanced Gantt chart with resource management',
    features: ['critical-path', 'resource-leveling', 'baseline-comparison'],
  });

  // Add Gantt export functionality
  context.api.registerRoute('POST', '/api/plugins/gantt/export', async (data: any) => {
    const { format, projectId } = data;
    return {
      success: true,
      format,
      downloadUrl: `/api/plugins/gantt/download/${projectId}.${format}`,
    };
  });
}

export async function deactivate() {
  console.log('[Gantt Pro] Plugin deactivated');
}