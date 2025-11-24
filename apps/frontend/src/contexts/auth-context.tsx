'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/env';

type ApiUser = {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
};

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'reciclaai_token';
const USER_KEY = 'reciclaai_user';

const normalizeUser = (apiUser: ApiUser): AuthUser => ({
  id: apiUser.id,
  name: apiUser.name,
  email: apiUser.email,
  createdAt: apiUser.created_at
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    const storedUser = window.localStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as AuthUser;
        setToken(storedToken);
        setUser(parsed);
      } catch (error) {
        console.warn('Não foi possível restaurar sessão', error);
      }
    }
    setIsLoading(false);
  }, []);

  const persistSession = (newToken: string, apiUser: ApiUser) => {
    const normalizedUser = normalizeUser(apiUser);
    setToken(newToken);
    setUser(normalizedUser);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TOKEN_KEY, newToken);
      window.localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
    }
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody?.detail ?? 'Falha no login');
    }

    const data = await res.json();
    persistSession(data.access_token, data.user);
    toast.success('Login realizado com sucesso!');
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody?.detail ?? 'Não foi possível criar conta');
    }

    await login(email, password);
    toast.success('Conta criada com sucesso!');
  };

  const logout = () => {
    clearSession();
    toast.success('Sessão encerrada.');
  };

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};


