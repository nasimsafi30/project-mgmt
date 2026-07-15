'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserPlus, Eye, EyeOff, User, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) { toast.error('Fill all fields'); return; }
    if (password.length < 6) { toast.error('Password must be 6+ characters'); return; }
    if (!email.includes('@')) { toast.error('Invalid email'); return; }
    
    setLoading(true);
    try {
      // Save to API
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name, email, password }),
      });
      
      if (res.ok) {
        const data = await res.json();
        // Save to localStorage too
        localStorage.setItem('currentUser', JSON.stringify({ name, email, id: data.user?.id }));
        toast.success(`Welcome, ${name}!`);
        router.push('/');
      } else {
        const err = await res.json();
        // Fallback to localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify({ name, email }));
        toast.success(`Welcome, ${name}!`);
        router.push('/');
      }
    } catch {
      // Offline fallback
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ name, email }));
      toast.success(`Welcome, ${name}!`);
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with gradient accent */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Start your journey with us today
        </p>
      </div>
      
      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="John Doe" 
              className="pl-10 h-11 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <Input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@example.com" 
              className="pl-10 h-11 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <Input 
              type={showPass ? 'text' : 'password'} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Min 6 characters" 
              className="pl-10 pr-10 h-11 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
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

        {/* Password Requirements */}
        <div className="flex gap-3">
          <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${password.length >= 6 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${/[A-Z]/.test(password) ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${/[0-9]/.test(password) ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
        </div>
      </div>

      {/* Register Button */}
      <Button 
        className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-[1.02]" 
        onClick={handleRegister} 
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Creating Account...</span>
          </div>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      {/* Features Highlight */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">🚀 Quick Setup</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get started in seconds</p>
        </div>
        <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30">
          <p className="text-xs font-medium text-teal-700 dark:text-teal-300">🔒 Secure</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your data is safe</p>
        </div>
      </div>

      {/* Sign In Link */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-emerald-600 hover:text-teal-600 dark:text-emerald-400 dark:hover:text-teal-400 transition-colors duration-200">
          Sign in here
        </a>
      </p>
    </div>
  );
}