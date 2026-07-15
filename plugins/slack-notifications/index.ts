// Slack Notifications Plugin
import { PluginContext } from '@/lib/plugin-system/PluginManager';

interface SlackConfig {
  webhookUrl: string;
  channel: string;
  notifyOn: string[];
}

export async function activate(context: PluginContext) {
  console.log('[Slack] Plugin activated');

  context.api.registerHook('task:created', async (task: any) => {
    const config = context.api.getSetting('config') as SlackConfig;
    if (config?.notifyOn?.includes('task.created')) {
      await sendSlackMessage(config.webhookUrl, {
        text: `📋 New task created: *${task.title}*`,
        channel: config.channel,
      });
    }
  });

  context.api.registerHook('task:completed', async (task: any) => {
    const config = context.api.getSetting('config') as SlackConfig;
    if (config?.notifyOn?.includes('task.completed')) {
      await sendSlackMessage(config.webhookUrl, {
        text: `✅ Task completed: *${task.title}*`,
        channel: config.channel,
      });
    }
  });
}

export async function deactivate() {
  console.log('[Slack] Plugin deactivated');
}

async function sendSlackMessage(webhookUrl: string, message: any) {
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('[Slack] Failed to send message:', error);
  }
}