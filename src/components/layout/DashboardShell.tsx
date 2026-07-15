'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, KanbanSquare, Calendar, Users, Clock, BarChart3, Settings,
  ChevronLeft, GitBranch, Timer, Bell, Plus, Store, LogOut, Briefcase,
  Moon, Sun, PanelLeftClose, PanelLeft, Search, Command, Sparkles,
  ChevronDown, CheckCircle2, MessageSquare, AlertTriangle,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Projects', href: '/projects', icon: Briefcase, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { name: 'Board', href: '/board', icon: KanbanSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { name: 'Calendar', href: '/calendar', icon: Calendar, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { name: 'Sprints', href: '/sprints', icon: Timer, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { name: 'Gantt', href: '/gantt', icon: GitBranch, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { name: 'Teams', href: '/teams', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { name: 'Time', href: '/tracking', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { name: 'Reports', href: '/reports', icon: BarChart3, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  { name: 'Marketplace', href: '/marketplace', icon: Store, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { name: 'Settings', href: '/settings', icon: Settings, color: 'text-gray-400', bg: 'bg-gray-500/10' },
];

const notifications = [
  { id: 1, title: 'Task Assigned', msg: 'Design homepage has been assigned to you', time: '5m ago', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', unread: true },
  { id: 2, title: 'New Comment', msg: 'Jane commented on your task', time: '15m ago', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', unread: true },
  { id: 3, title: 'Deadline Approaching', msg: 'API integration task due tomorrow', time: '1h ago', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', unread: false },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) setUser(JSON.parse(saved));
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) setAvatar(savedAvatar);
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') { 
      document.documentElement.classList.add('dark'); 
      setDark(true); 
    }
  }, []);

  const toggleDark = () => {
    const next = !dark; 
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  const handleLogout = () => { 
    localStorage.removeItem('currentUser'); 
    router.push('/login'); 
  };

  const initials = user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  const currentPage = navigation.find(n => pathname === n.href);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className={cn(
        'bg-gray-900 dark:bg-gray-900 text-white flex flex-col border-r border-gray-800 transition-all duration-300 flex-shrink-0 relative',
        sidebarOpen ? 'w-64' : 'w-20'
      )}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between h-16">
          {sidebarOpen ? (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ProjectHub
              </span>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg p-1.5 transition-all"
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Action Button */}
        {sidebarOpen && (
          <div className="p-3">
            <Link 
              href="/board" 
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-2.5 text-sm font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <Plus className="w-4 h-4" />
              New Task
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/20 text-xs font-mono">
                <Command className="w-3 h-3" />N
              </kbd>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-auto">
          {navigation.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative',
                  isActive 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                )}
                title={!sidebarOpen ? item.name : undefined}
              >
                <div className={cn(
                  'p-1.5 rounded-lg transition-all duration-200',
                  isActive ? item.bg : 'group-hover:bg-gray-800'
                )}>
                  <item.icon className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? item.color : 'text-gray-400 group-hover:text-white'
                  )} />
                </div>
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </>
                )}
                {!sidebarOpen && isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-800">
          {user && sidebarOpen && (
            <div className="mb-3 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="User" 
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-gray-700" 
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout} 
            className={cn(
              'flex items-center gap-3 w-full rounded-xl p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all group',
              !sidebarOpen && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {currentPage && (
                <div className={cn('p-1.5 rounded-lg', currentPage.bg)}>
                  <currentPage.icon className={cn('w-4 h-4', currentPage.color)} />
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentPage?.name || 'Dashboard'}
              </h2>
            </div>
            
            {/* Search Bar */}
            <div className={cn(
              'hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-1.5 transition-all duration-200',
              searchFocused && 'ring-2 ring-blue-500/20 bg-white dark:bg-gray-700'
            )}>
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 w-40"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 font-mono">
                <Command className="w-3 h-3" />K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDark} 
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              {dark ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className={cn(
                  'relative p-2 rounded-xl transition-all',
                  showNotifications 
                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
              </button>
              
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-20 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                        3 new
                      </span>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={cn(
                            'p-4 border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors',
                            n.unread && 'bg-blue-50/30 dark:bg-blue-950/10'
                          )}
                        >
                          <div className="flex gap-3">
                            <div className={cn('p-2 rounded-lg', n.bg)}>
                              <n.icon className={cn('w-4 h-4', n.color)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{n.title}</p>
                                {n.unread && (
                                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.msg}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                      <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-500/20" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {initials}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                  {user?.name}
                </span>
                <ChevronDown className={cn(
                  'w-4 h-4 text-gray-400 transition-transform duration-200',
                  showUserMenu && 'rotate-180'
                )} />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-20 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link 
                        href="/settings" 
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}