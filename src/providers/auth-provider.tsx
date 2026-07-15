'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';

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
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (!clerkUser?.id) return;
    try {
      const response = await fetch(`/api/users/${clerkUser.id}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, [clerkUser?.id]);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && clerkUser) {
        setUser({
          id: clerkUser.id,
          name: clerkUser.fullName || clerkUser.username || 'User',
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          avatarUrl: clerkUser.imageUrl,
          role: (clerkUser.publicMetadata?.role as string) || 'member',
          permissions: (clerkUser.publicMetadata?.permissions as string[]) || [],
        });
        fetchUserData();
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, clerkUser, fetchUserData]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'owner' || user.role === 'admin') return true;
    return user.permissions?.includes(permission) || false;
  }, [user]);

  const hasRole = useCallback((role: string): boolean => {
    if (!user) return false;
    const roleHierarchy: Record<string, number> = {
      owner: 4,
      admin: 3,
      member: 2,
      viewer: 1,
    };
    return (roleHierarchy[user.role] || 0) >= (roleHierarchy[role] || 0);
  }, [user]);

  const refreshUser = useCallback(async () => {
    if (clerkUser) {
      await clerkUser.reload();
      await fetchUserData();
    }
  }, [clerkUser, fetchUserData]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      hasPermission,
      hasRole,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}