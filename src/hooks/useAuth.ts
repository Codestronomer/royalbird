// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from '~/lib/api';
import type { ApiResponse } from '~/types/api';
import type { AuthResponse, PasswordChangeDto, User, UserLoginDto, UserRegistrationDto } from '~/types/user';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  
  // Auth methods
  login: (credentials: UserLoginDto) => Promise<AuthResponse>;
  register: (userData: UserRegistrationDto) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  
  // User methods
  updateProfile: (data: Partial<User>) => Promise<AuthResponse>;
  changePassword: (data: PasswordChangeDto) => Promise<ApiResponse<unknown>>;
  
  // Check methods
  checkAuth: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    if (!api.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getCurrentUser();
      
      if (response.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Failed to check authentication');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user on mount
  useEffect(() => {
    void checkAuth();
    
    // Listen for auth events
    const handleAuthExpired = () => {
      setUser(null);
      setError('Session expired. Please login again.');
    };
    
    window.addEventListener('auth-expired', handleAuthExpired);
    
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, [checkAuth]);


  const login = useCallback(async (credentials: UserLoginDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.login(credentials);
      
      if (response.success) {
        setUser(response.data.user);
      }
      
      return response;
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: UserRegistrationDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.register(userData);
      
      if (response.success) {
        setUser(response.data.user);
      }
      
      return response;
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.updateProfile(data);
      
      if (response.success) {
        setUser(response.data.user);
      }
      
      return response;
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (data: PasswordChangeDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.changePassword(data);
      return response;
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const hasRole = useCallback((role: string): boolean => {
    return user?.role === role;
  }, [user]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    
    checkAuth,
    hasRole,
  };
}