
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'teacher';
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'parent' | 'teacher') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('readease-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, you would validate credentials with a backend API
      // For demo purposes, we'll mock this with a simple check
      if (email === 'demo@readease.com' && password === 'password') {
        const userData = {
          id: '1',
          name: 'Demo User',
          email: 'demo@readease.com',
          role: 'student' as const,
        };
        localStorage.setItem('readease-user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Logged in successfully!');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'parent' | 'teacher') => {
    try {
      setIsLoading(true);
      // In a real app, this would send data to a backend API
      // For demo purposes we'll simulate registration success
      const userData = {
        id: Date.now().toString(),
        name,
        email,
        role,
      };
      
      localStorage.setItem('readease-user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error('Registration failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('readease-user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
