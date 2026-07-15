'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Bell, Shield, Palette, User, Sun, Moon, Monitor, Key, Save, Upload, Camera, Sparkles, CheckCircle2, Mail, Smartphone, MessageSquare, AtSign, GitBranch } from 'lucide-react';

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Admin' });
  const [notifications, setNotifications] = useState({ email: true, push: true, desktop: false, comments: true, mentions: true, updates: true });
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [fontSize, setFontSize] = useState('medium');
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as any;
    if (saved) setTheme(saved);
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) setAvatarUrl(savedAvatar);
    const savedName = localStorage.getItem('userName');
    if (savedName) setProfile(p => ({...p, firstName: savedName.split(' ')[0] || '', lastName: savedName.split(' ')[1] || ''}));
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (newTheme === 'system') {
      root.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else {
      root.classList.add(newTheme);
    }
    toast.success(`Theme switched to ${newTheme} mode`);
  };

  // AVATAR UPLOAD
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarUrl(base64);
      localStorage.setItem('userAvatar', base64);
      window.dispatchEvent(new StorageEvent('storage', { key: 'userAvatar', newValue: base64 }));
      toast.success('Profile photo updated!');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (section: string) => {
    // Save profile to localStorage
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    localStorage.setItem('userName', fullName);
    localStorage.setItem('userRole', profile.role);
    setSaving(section);
    setTimeout(() => { setSaving(''); toast.success(`${section} saved successfully!`); }, 500);
  };

  const initials = `${profile.firstName} ${profile.lastName}`.split(' ').map(n => n[0]).join('').toUpperCase() || 'JD';

  const notificationItems = [
    { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
    { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications in browser', icon: Smartphone },
    { key: 'desktop', label: 'Desktop Notifications', desc: 'Show desktop notifications', icon: Monitor },
    { key: 'comments', label: 'Comments', desc: 'When someone comments on your tasks', icon: MessageSquare },
    { key: 'mentions', label: 'Mentions', desc: 'When someone @mentions you', icon: AtSign },
    { key: 'updates', label: 'Task Updates', desc: 'When tasks are updated or moved', icon: GitBranch },
  ];

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light', desc: 'Bright and clean' },
    { value: 'dark', icon: Moon, label: 'Dark', desc: 'Easy on the eyes' },
    { value: 'system', icon: Monitor, label: 'System', desc: 'Follows your OS' },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
            <Sparkles className="w-7 h-7 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-slate-300 mt-1">Customize your experience and manage your account</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl gap-1">
          {[
            { value: 'profile', icon: User, label: 'Profile' },
            { value: 'notifications', icon: Bell, label: 'Notifications' },
            { value: 'appearance', icon: Palette, label: 'Appearance' },
            { value: 'security', icon: Shield, label: 'Security' },
          ].map(tab => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200 gap-2 px-4 py-2"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="dark:text-white text-lg">Profile Information</CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">Update your personal details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-gray-700 shadow-xl transition-transform duration-300 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-gray-700 shadow-xl transition-transform duration-300 group-hover:scale-105">
                      {initials}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="dark:border-gray-700 dark:text-gray-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />Upload Photo
                  </Button>
                  <p className="text-xs text-gray-400">Click avatar or button to upload</p>
                  <p className="text-xs text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</Label>
                  <Input 
                    value={profile.firstName} 
                    onChange={e => setProfile({...profile, firstName: e.target.value})} 
                    className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</Label>
                  <Input 
                    value={profile.lastName} 
                    onChange={e => setProfile({...profile, lastName: e.target.value})} 
                    className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                  <Input 
                    type="email" 
                    value={profile.email} 
                    onChange={e => setProfile({...profile, email: e.target.value})} 
                    className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</Label>
                  <Input 
                    disabled 
                    value={profile.role} 
                    className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-400" 
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <Button 
                  onClick={() => handleSave('Profile')} 
                  disabled={saving==='Profile'}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                >
                  {saving==='Profile' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                  <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle className="dark:text-white text-lg">Notification Preferences</CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">Choose what notifications you receive</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-1">
              {notificationItems.map(item => {
                const Icon = item.icon;
                const isEnabled = notifications[item.key as keyof typeof notifications];
                return (
                  <div 
                    key={item.key} 
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'p-2 rounded-lg transition-colors duration-200',
                        isEnabled 
                          ? 'bg-blue-50 dark:bg-blue-950/30' 
                          : 'bg-gray-100 dark:bg-gray-800'
                      )}>
                        <Icon className={cn(
                          'w-4 h-4 transition-colors duration-200',
                          isEnabled 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        )} />
                      </div>
                      <div>
                        <Label className={cn(
                          'font-medium transition-colors duration-200',
                          isEnabled 
                            ? 'text-gray-900 dark:text-gray-200' 
                            : 'text-gray-400 dark:text-gray-500'
                        )}>
                          {item.label}
                        </Label>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={isEnabled} 
                      onCheckedChange={v => setNotifications({...notifications, [item.key]: v})} 
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                );
              })}
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => handleSave('Notification')} 
                  disabled={saving==='Notification'}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
                >
                  {saving==='Notification' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-6">
          <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                  <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="dark:text-white text-lg">Appearance Settings</CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">Customize how ProjectHub looks</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="space-y-4">
                <Label className="text-base font-semibold text-gray-900 dark:text-white">Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  {themeOptions.map(item => {
                    const Icon = item.icon;
                    const isActive = theme === item.value;
                    return (
                      <button 
                        key={item.value} 
                        onClick={() => applyTheme(item.value as any)}
                        className={cn(
                          'flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group',
                          isActive 
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-lg shadow-purple-500/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-900/30 hover:shadow-md'
                        )}
                      >
                        {isActive && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="w-5 h-5 text-purple-500" />
                          </div>
                        )}
                        <div className={cn(
                          'p-3 rounded-xl transition-all duration-300 group-hover:scale-110',
                          isActive 
                            ? 'bg-purple-100 dark:bg-purple-900/30' 
                            : 'bg-gray-100 dark:bg-gray-800'
                        )}>
                          <Icon className={cn(
                            'w-8 h-8 transition-colors duration-300',
                            isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'
                          )} />
                        </div>
                        <div>
                          <span className={cn(
                            'font-semibold text-sm block transition-colors duration-300',
                            isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                          )}>
                            {item.label}
                          </span>
                          <span className="text-xs text-gray-400">{item.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSave('Appearance')} 
                  disabled={saving==='Appearance'}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                >
                  {saving==='Appearance' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
                  <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="dark:text-white text-lg">Change Password</CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">Keep your account secure</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</Label>
                <Input 
                  type="password" 
                  value={password.current} 
                  onChange={e => setPassword({...password, current: e.target.value})} 
                  className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500/20 transition-all"
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</Label>
                <Input 
                  type="password" 
                  value={password.newPass} 
                  onChange={e => setPassword({...password, newPass: e.target.value})} 
                  className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500/20 transition-all"
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</Label>
                <Input 
                  type="password" 
                  value={password.confirm} 
                  onChange={e => setPassword({...password, confirm: e.target.value})} 
                  className="h-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500/20 transition-all"
                  placeholder="Confirm new password"
                />
              </div>
              
              {/* Password Strength Indicator */}
              {password.newPass && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 space-y-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Password Strength</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(level => (
                      <div 
                        key={level}
                        className={cn(
                          'flex-1 h-1.5 rounded-full transition-all duration-300',
                          password.newPass.length >= level * 3 
                            ? level <= 2 
                              ? 'bg-red-500' 
                              : level === 3 
                                ? 'bg-amber-500' 
                                : 'bg-emerald-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {password.newPass.length < 6 ? 'Too weak' :
                     password.newPass.length < 8 ? 'Could be stronger' :
                     password.newPass.length < 10 ? 'Strong password' : 'Very strong password'}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end pt-2">
                <Button 
                  onClick={() => {
                    if (password.newPass !== password.confirm) { toast.error('Passwords do not match'); return; }
                    if (password.newPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
                    handleSave('Password'); 
                    setPassword({ current: '', newPass: '', confirm: '' });
                  }} 
                  disabled={saving==='Password' || !password.current || !password.newPass}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300"
                >
                  {saving==='Password' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />Update Password
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


