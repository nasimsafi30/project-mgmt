'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Loader2, Sparkles } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const publicPaths = ['/login', '/register'];
    
    if (publicPaths.includes(pathname)) {
      setChecked(true);
      return;
    }

    const user = localStorage.getItem('currentUser');
    if (user) {
      setIsAuth(true);
      setChecked(true);
    } else {
      router.replace('/login');
    }
  }, [pathname, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/25 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 absolute -bottom-2 -right-2" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Loading...</p>
            <p className="text-xs text-gray-400 mt-1">Setting up your workspace</p>
          </div>
        </div>
      </div>
    );
  }

  const publicPaths = ['/login', '/register'];
  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  if (isAuth) {
    return <DashboardShell>{children}</DashboardShell>;
  }

  return null;
}