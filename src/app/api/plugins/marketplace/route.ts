import { NextRequest, NextResponse } from 'next/server';

const marketplacePlugins = [
  { id: 'github-sync', name: 'GitHub Sync', description: 'Two-way sync with GitHub', author: 'ProjectHub', version: '2.1.0', price: 0, rating: 4.8, downloads: 12000, category: 'integration', verified: true },
  { id: 'slack-notifications', name: 'Slack Notifications', description: 'Send updates to Slack', author: 'ProjectHub', version: '1.5.2', price: 0, rating: 4.6, downloads: 8500, category: 'integration', verified: true },
  { id: 'gantt-pro', name: 'Gantt Chart Pro', description: 'Advanced Gantt charts', author: 'ThirdParty Inc.', version: '3.0.1', price: 49, rating: 4.9, downloads: 5200, category: 'visualization', verified: true },
  { id: 'ai-assistant', name: 'AI Assistant', description: 'AI-powered task management', author: 'AI Labs', version: '1.2.0', price: 99, rating: 4.7, downloads: 3200, category: 'automation', verified: false },
  { id: 'dark-theme', name: 'Dark Theme Pro', description: 'Beautiful dark theme', author: 'DesignHub', version: '1.0.0', price: 0, rating: 4.4, downloads: 15000, category: 'theme', verified: true },
  { id: 'time-reports', name: 'Advanced Time Reports', description: 'Detailed time tracking reports', author: 'DataViz Co.', version: '2.3.0', price: 29, rating: 4.5, downloads: 6800, category: 'reporting', verified: true },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  
  let plugins = marketplacePlugins;
  if (category && category !== 'all') {
    plugins = plugins.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    plugins = plugins.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  
  return NextResponse.json({ plugins, total: plugins.length });
}
