'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      const userData = JSON.parse(saved);
      setUser({
        id: userData.id || '1',
        name: userData.name || 'User',
        email: userData.email || '',
        role: userData.role || 'member',
        permissions: userData.permissions || [],
      });
    }
    setIsLoading(false);
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'owner' || user.role === 'admin') return true;
    return user.permissions?.includes(permission) || false;
  }, [user]);

  const hasRole = useCallback((role: string): boolean => {
    if (!user) return false;
    const roleHierarchy: Record<string, number> = { owner: 4, admin: 3, member: 2, viewer: 1 };
    return (roleHierarchy[user.role] || 0) >= (roleHierarchy[role] || 0);
  }, [user]);

  const refreshUser = useCallback(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      const userData = JSON.parse(saved);
      setUser({
        id: userData.id || '1',
        name: userData.name || 'User',
        email: userData.email || '',
        role: userData.role || 'member',
        permissions: userData.permissions || [],
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, hasPermission, hasRole, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
