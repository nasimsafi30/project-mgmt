// Dark Theme Pro Plugin
import { PluginContext } from '@/lib/plugin-system/PluginManager';

interface ThemeConfig {
  mode: 'dark' | 'light' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  fontFamily: string;
}

export async function activate(context: PluginContext) {
  console.log('[Dark Theme] Plugin activated');

  const config = context.api.getSetting('config') as ThemeConfig || {
    mode: 'dark',
    accentColor: '#3B82F6',
    fontSize: 'medium',
    borderRadius: 'medium',
    fontFamily: 'Inter',
  };

  applyTheme(config);

  // Listen for theme changes
  context.api.registerHook('settings:themeChanged', (newConfig: ThemeConfig) => {
    applyTheme(newConfig);
  });

  // Register theme settings component
  context.api.registerComponent('ThemeSettings', {
    name: 'ThemeSettings',
    description: 'Customize your theme',
  });
}

export async function deactivate() {
  console.log('[Dark Theme] Plugin deactivated');
  // Revert to default theme
  document.documentElement.classList.remove('dark', 'theme-custom');
}

function applyTheme(config: ThemeConfig) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Apply dark mode
  if (config.mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Apply accent color
  root.style.setProperty('--accent', config.accentColor);

  // Apply font size
  const sizes = { small: '14px', medium: '16px', large: '18px' };
  root.style.fontSize = sizes[config.fontSize];

  // Apply border radius
  const radii = { none: '0px', small: '4px', medium: '8px', large: '16px' };
  root.style.setProperty('--radius', radii[config.borderRadius]);

  // Apply font family
  root.style.fontFamily = config.fontFamily;
}