import type { Metadata } from 'next';
import './globals.css';
import { AuthGuard } from '@/components/layout/AuthGuard';

export const metadata: Metadata = {
  title: 'ProjectHub',
  description: 'Enterprise Project Management Platform',
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
