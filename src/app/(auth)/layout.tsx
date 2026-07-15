'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl">🚀</Link>
          <h1 className="text-2xl font-bold mt-4 dark:text-white">ProjectHub</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Enterprise Project Management</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border dark:border-gray-700">
          {children}
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="/login" className={cn('text-sm', pathname === '/login' ? 'text-blue-600 font-medium' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300')}>Login</Link>
          <Link href="/register" className={cn('text-sm', pathname === '/register' ? 'text-blue-600 font-medium' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300')}>Register</Link>
        </div>
      </div>
    </div>
  );
}
