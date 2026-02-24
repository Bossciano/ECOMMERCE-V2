// ============================================================================
// LOCAL AUTHENTICATION CONTEXT (No Backend)
// ============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (data: { full_name?: string; phone?: string }) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAdmin(parsedUser.email === 'admin@example.com');
      } catch (error) {
        console.error('Error parsing saved user:', error);
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '{}');
      if (existingUsers[email]) {
        const error = 'Email already registered';
        toast({
          title: 'Sign up failed',
          description: error,
          variant: 'destructive',
        });
        return { error };
      }

      // Store user
      const newUser = { id: Date.now().toString(), email, full_name: fullName };
      existingUsers[email] = { password, user: newUser };
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Auto sign in
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      setIsAdmin(email === 'admin@example.com');

      toast({
        title: 'Account created successfully!',
        description: 'Welcome to our store.',
      });

      return { error: null };
    } catch (error: any) {
      const errorMsg = error.message || 'Sign up failed';
      toast({
        title: 'Sign up failed',
        description: errorMsg,
        variant: 'destructive',
      });
      return { error: errorMsg };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const userData = users[email];

      if (!userData || userData.password !== password) {
        const error = 'Invalid email or password';
        toast({
          title: 'Sign in failed',
          description: error,
          variant: 'destructive',
        });
        return { error };
      }

      setUser(userData.user);
      localStorage.setItem('auth_user', JSON.stringify(userData.user));
      setIsAdmin(email === 'admin@example.com');

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });

      return { error: null };
    } catch (error: any) {
      const errorMsg = error.message || 'Sign in failed';
      toast({
        title: 'Sign in failed',
        description: errorMsg,
        variant: 'destructive',
      });
      return { error: errorMsg };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('auth_user');

      toast({
        title: 'Signed out successfully',
        description: 'Come back soon!',
      });
    } catch (error: any) {
      toast({
        title: 'Sign out failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // In a real app, this would send an email
      toast({
        title: 'Password reset',
        description: 'Check your email for reset instructions.',
      });
      return { error: null };
    } catch (error: any) {
      const errorMsg = error.message || 'Password reset failed';
      toast({
        title: 'Password reset failed',
        description: errorMsg,
        variant: 'destructive',
      });
      return { error: errorMsg };
    }
  };

  const updateProfile = async (data: { full_name?: string; phone?: string }) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));

      toast({
        title: 'Profile updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Profile update failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
