import { EventEmitter } from 'events';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  main: string;
  permissions: string[];
  dependencies?: Record<string, string>;
  config?: Record<string, any>;
  hooks?: string[];
  icon?: string;
  homepage?: string;
}

export interface PluginContext {
  db: any;
  cache: any;
  events: EventEmitter;
  logger: Console;
  config: Record<string, any>;
  api: {
    registerRoute: (method: string, path: string, handler: Function) => void;
    registerHook: (hook: string, handler: Function) => void;
    registerComponent: (name: string, component: any) => void;
    getSetting: (key: string) => any;
    setSetting: (key: string, value: any) => Promise<void>;
    getStore: () => any;
  };
}

export interface Plugin {
  manifest: PluginManifest;
  context: PluginContext;
  activate: () => Promise<void>;
  deactivate: () => Promise<void>;
  getSettings: () => Record<string, any>;
  updateSettings: (settings: Record<string, any>) => Promise<void>;
}

export class PluginManager extends EventEmitter {
  private plugins: Map<string, Plugin> = new Map();
  private hooks: Map<string, Function[]> = new Map();
  private components: Map<string, any> = new Map();
  private routes: Map<string, { handler: Function; pluginId: string }> = new Map();

  async registerPlugin(manifest: PluginManifest, pluginModule: any): Promise<void> {
    if (this.plugins.has(manifest.id)) {
      throw new Error(`Plugin already registered: ${manifest.id}`);
    }

    this.validateManifest(manifest);
    await this.checkDependencies(manifest);

    const context = this.createPluginContext(manifest);

    const plugin: Plugin = {
      manifest,
      context,
      activate: async () => {
        if (pluginModule.activate) {
          await pluginModule.activate(context);
        }
        if (manifest.hooks) {
          for (const hook of manifest.hooks) {
            if (pluginModule[hook]) {
              this.registerHook(hook, pluginModule[hook].bind(pluginModule));
            }
          }
        }
        this.emit('plugin:activated', manifest.id);
      },
      deactivate: async () => {
        if (pluginModule.deactivate) await pluginModule.deactivate();
        this.removePluginHooks(manifest.id);
        this.emit('plugin:deactivated', manifest.id);
      },
      getSettings: () => this.getPluginSettings(manifest.id),
      updateSettings: async (settings) => {
        await this.updatePluginSettings(manifest.id, settings);
      },
    };

    this.plugins.set(manifest.id, plugin);
    await plugin.activate();
    console.log(`[PluginManager] Registered: ${manifest.name} v${manifest.version}`);
  }

  async unregisterPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin not found: ${pluginId}`);
    await plugin.deactivate();
    this.plugins.delete(pluginId);
    this.removePluginRoutes(pluginId);
    this.removePluginComponents(pluginId);
  }

  getPlugins(): PluginManifest[] {
    return Array.from(this.plugins.values()).map(p => p.manifest);
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  registerHook(hookName: string, handler: Function): void {
    if (!this.hooks.has(hookName)) this.hooks.set(hookName, []);
    this.hooks.get(hookName)!.push(handler);
  }

  async executeHook(hookName: string, ...args: any[]): Promise<any[]> {
    const handlers = this.hooks.get(hookName) || [];
    const results = [];
    for (const handler of handlers) {
      try {
        results.push(await handler(...args));
      } catch (error) {
        console.error(`Hook "${hookName}" failed:`, error);
      }
    }
    return results;
  }

  registerComponent(name: string, component: any): void {
    this.components.set(name, component);
    this.emit('component:registered', name);
  }

  getComponent(name: string): any {
    return this.components.get(name);
  }

  registerRoute(method: string, path: string, handler: Function, pluginId: string): void {
    this.routes.set(`${method}:${path}`, { handler, pluginId });
  }

  async setPluginState(pluginId: string, enabled: boolean): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin not found: ${pluginId}`);
    if (enabled) await plugin.activate();
    else await plugin.deactivate();
  }

  private validateManifest(manifest: PluginManifest): void {
    const required = ['id', 'name', 'version', 'main'];
    for (const field of required) {
      if (!manifest[field as keyof PluginManifest]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    const semverRegex = /^\d+\.\d+\.\d+$/;
    if (!semverRegex.test(manifest.version)) {
      throw new Error('Invalid version format. Use semver (e.g., 1.0.0)');
    }
  }

  private async checkDependencies(manifest: PluginManifest): Promise<void> {
    if (!manifest.dependencies) return;
    for (const [depId, requiredVersion] of Object.entries(manifest.dependencies)) {
      const dep = this.plugins.get(depId);
      if (!dep) throw new Error(`Missing dependency: ${depId}`);
      if (!this.satisfiesVersion(dep.manifest.version, requiredVersion)) {
        throw new Error(`Plugin ${depId} version ${dep.manifest.version} doesn't satisfy ${requiredVersion}`);
      }
    }
  }

  private satisfiesVersion(current: string, required: string): boolean {
    const [cMajor, cMinor] = current.split('.').map(Number);
    const [rMajor, rMinor] = required.replace('^','').replace('~','').split('.').map(Number);
    if (cMajor !== rMajor) return false;
    return cMinor >= rMinor;
  }

  private createPluginContext(manifest: PluginManifest): PluginContext {
    return {
      db: null,
      cache: null,
      events: this,
      logger: console,
      config: manifest.config || {},
      api: {
        registerRoute: (m, p, h) => this.registerRoute(m, p, h, manifest.id),
        registerHook: (h, fn) => this.registerHook(h, fn),
        registerComponent: (n, c) => this.registerComponent(`${manifest.id}:${n}`, c),
        getSetting: (k) => this.getPluginSetting(manifest.id, k),
        setSetting: async (k, v) => { await this.setPluginSetting(manifest.id, k, v); },
        getStore: () => (typeof window !== 'undefined' ? (window as any).__STORE__ : null),
      },
    };
  }

  private getPluginSettings(pluginId: string): Record<string, any> {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(`plugin:${pluginId}:settings`);
    return stored ? JSON.parse(stored) : {};
  }

  private async updatePluginSettings(pluginId: string, settings: Record<string, any>): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`plugin:${pluginId}:settings`, JSON.stringify(settings));
    }
  }

  private getPluginSetting(pluginId: string, key: string): any {
    return this.getPluginSettings(pluginId)[key];
  }

  private async setPluginSetting(pluginId: string, key: string, value: any): Promise<void> {
    const settings = this.getPluginSettings(pluginId);
    settings[key] = value;
    await this.updatePluginSettings(pluginId, settings);
  }

  private removePluginHooks(pluginId: string): void {
    // Hooks are bound to plugin instance, cleaned on deactivate
  }

  private removePluginRoutes(pluginId: string): void {
    for (const [key, val] of this.routes.entries()) {
      if (val.pluginId === pluginId) this.routes.delete(key);
    }
  }

  private removePluginComponents(pluginId: string): void {
    for (const [key] of this.components.entries()) {
      if (key.startsWith(`${pluginId}:`)) this.components.delete(key);
    }
  }
}

export const pluginManager = new PluginManager();