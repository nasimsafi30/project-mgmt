'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Bell, Palette, Shield } from 'lucide-react';

const items = [
  { name: 'Profile', href: '/settings', icon: User },
  { name: 'Notifications', href: '/settings/notifications', icon: Bell },
  { name: 'Appearance', href: '/settings/appearance', icon: Palette },
  { name: 'Security', href: '/settings/security', icon: Shield },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {items.map(i => {
        const active = pathname === i.href;
        return (
          <Link key={i.name} href={i.href}
            className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', active?'bg-blue-50 text-blue-600':'text-gray-600 hover:bg-gray-50')}>
            <i.icon className="w-5 h-5" />{i.name}
          </Link>
        );
      })}
    </nav>
  );
}