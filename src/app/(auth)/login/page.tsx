'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogIn, Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) { toast.error('Fill all fields'); return; }
    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Also check demo account
      const allUsers = [...users, { name: 'Demo User', email: 'demo@projecthub.com', password: 'demo123' }];
      const user = allUsers.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
        toast.success(`Welcome back, ${user.name}!`);
        router.push('/');
      } else {
        toast.error('Invalid email or password');
      }
      setLoading(false);
    }, 800);
  };

  // Quick login with demo
  const demoLogin = () => {
    setEmail('demo@projecthub.com');
    setPassword('demo123');
    setTimeout(() => {
      localStorage.setItem('currentUser', JSON.stringify({ name: 'Demo User', email: 'demo@projecthub.com' }));
      toast.success('Logged in as Demo User!');
      router.push('/');
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header with gradient accent */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your credentials to continue your journey
        </p>
      </div>
      
      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <Input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@example.com" 
              className="pl-10 h-11 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <Input 
              type={showPass ? 'text' : 'password'} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="pl-10 pr-10 h-11 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
            <button 
              onClick={() => setShowPass(!showPass)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              type="button"
            >
              {showPass ? (
                <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sign In Button */}
      <Button 
        className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02]" 
        onClick={handleLogin} 
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Signing in...</span>
          </div>
        ) : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
            Quick Access
          </span>
        </div>
      </div>

      {/* Demo Account Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-100 dark:border-blue-900/30 p-6 group hover:shadow-lg transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
        <div className="relative space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Demo Account</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">demo@projecthub.com</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Lock className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">demo123</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition-all duration-200" 
            onClick={demoLogin}
          >
            <Sparkles className="w-3 h-3 mr-2" />
            Quick Login as Demo
          </Button>
        </div>
      </div>

      {/* Register Link */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?{' '}
        <a href="/register" className="font-medium text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 transition-colors duration-200">
          Create one here
        </a>
      </p>
    </div>
  );
}