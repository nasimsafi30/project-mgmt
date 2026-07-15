import { NextRequest, NextResponse } from 'next/server';

const availableIntegrations = [
  { id: 'github', name: 'GitHub', description: 'Sync issues and pull requests', category: 'development', icon: 'github', connected: false },
  { id: 'slack', name: 'Slack', description: 'Send notifications to channels', category: 'communication', icon: 'slack', connected: false },
  { id: 'figma', name: 'Figma', description: 'Embed designs and prototypes', category: 'design', icon: 'figma', connected: false },
  { id: 'gitlab', name: 'GitLab', description: 'Sync with GitLab projects', category: 'development', icon: 'gitlab', connected: false },
  { id: 'discord', name: 'Discord', description: 'Send updates to Discord', category: 'communication', icon: 'discord', connected: false },
  { id: 'jira', name: 'Jira', description: 'Import from Jira', category: 'development', icon: 'jira', connected: false },
  { id: 'google-drive', name: 'Google Drive', description: 'Attach files from Drive', category: 'storage', icon: 'google-drive', connected: false },
  { id: 'notion', name: 'Notion', description: 'Sync with Notion databases', category: 'productivity', icon: 'notion', connected: false },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let integrations = availableIntegrations;
    if (category && category !== 'all') {
      integrations = integrations.filter(i => i.category === category);
    }
    
    return NextResponse.json({ integrations, total: integrations.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 });
  }
}
