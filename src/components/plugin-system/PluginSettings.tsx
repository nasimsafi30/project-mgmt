'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, RotateCcw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PluginSettingsProps {
  pluginId: string;
  pluginName: string;
  initialSettings?: Record<string, any>;
  onSave?: (settings: Record<string, any>) => void;
}

export function PluginSettings({ pluginId, pluginName, initialSettings = {}, onSave }: PluginSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave?.(settings);
    setHasChanges(false);
    toast.success('Settings saved');
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setHasChanges(false);
    toast.info('Settings reset');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Plugin Settings
        </CardTitle>
        <CardDescription>Configure {pluginName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Configuration */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-500 uppercase">API Configuration</h3>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              value={settings.apiKey || ''}
              onChange={e => updateSetting('apiKey', e.target.value)}
              placeholder="Enter API key"
            />
          </div>
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              value={settings.webhookUrl || ''}
              onChange={e => updateSetting('webhookUrl', e.target.value)}
              placeholder="https://hooks.example.com/webhook"
            />
          </div>
        </div>

        {/* Sync Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-500 uppercase">Sync Settings</h3>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Sync</Label>
              <p className="text-xs text-gray-400">Automatically sync data</p>
            </div>
            <Switch
              checked={settings.autoSync ?? true}
              onCheckedChange={v => updateSetting('autoSync', v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Sync Interval</Label>
            <Select
              value={settings.syncInterval || '15'}
              onValueChange={v => updateSetting('syncInterval', v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Every 5 minutes</SelectItem>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-500 uppercase">Notifications</h3>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Notifications</Label>
              <p className="text-xs text-gray-400">Receive plugin notifications</p>
            </div>
            <Switch
              checked={settings.notifications ?? true}
              onCheckedChange={v => updateSetting('notifications', v)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-amber-600">
            <AlertCircle className="w-4 h-4" />
            {hasChanges && 'You have unsaved changes'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="w-4 h-4 mr-2" />Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />Save Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}