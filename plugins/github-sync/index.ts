// GitHub Sync Plugin
import { PluginContext } from '@/lib/plugin-system/PluginManager';

interface GitHubConfig {
  token: string;
  repository: string;
  syncInterval: number;
  syncIssues: boolean;
  syncPRs: boolean;
}

export async function activate(context: PluginContext) {
  console.log('[GitHub Sync] Plugin activated');

  context.api.registerRoute('GET', '/api/plugins/github/status', async () => ({
    connected: true,
    lastSync: new Date().toISOString(),
  }));

  context.api.registerHook('task:created', async (task: any) => {
    const config = context.api.getSetting('config') as GitHubConfig;
    if (config?.syncIssues) {
      console.log('[GitHub Sync] Creating issue for task:', task.title);
    }
  });

  context.api.registerHook('task:completed', async (task: any) => {
    console.log('[GitHub Sync] Closing issue for task:', task.title);
  });

  const config = context.api.getSetting('config') as GitHubConfig;
  if (config?.syncInterval > 0) {
    setInterval(() => syncData(context), config.syncInterval * 60000);
  }
}

export async function deactivate() {
  console.log('[GitHub Sync] Plugin deactivated');
}

async function syncData(context: PluginContext) {
  console.log('[GitHub Sync] Syncing data...');
  const config = context.api.getSetting('config') as GitHubConfig;
  // Fetch and sync issues/PRs
}