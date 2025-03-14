'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string;
  name?: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token in localStorage and validate it
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          // In a real app, you would verify the token with your backend
          // For now, we'll just simulate authentication by storing user info in localStorage
          const userData = localStorage.getItem('user_data');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // In a real app, you would verify password against the backend
      if (password.length < 1) {
        throw new Error('Password cannot be empty');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      const fakeUser = { id: '123', email };
      const fakeToken = 'fake_jwt_token_' + Math.random().toString(36).substring(2);
      
      // Store authentication data
      localStorage.setItem('auth_token', fakeToken);
      localStorage.setItem('user_data', JSON.stringify(fakeUser));
      
      setUser(fakeUser);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    try {
      // In a real app, you would send a request to your backend
      // For this PoC, we'll simulate a successful registration
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful registration
      const fakeUser = { id: '123', email, name };
      const fakeToken = 'fake_jwt_token_' + Math.random().toString(36).substring(2);
      
      // Store authentication data
      localStorage.setItem('auth_token', fakeToken);
      localStorage.setItem('user_data', JSON.stringify(fakeUser));
      
      setUser(fakeUser);
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 