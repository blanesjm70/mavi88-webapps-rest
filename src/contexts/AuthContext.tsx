import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RegisterCredentials } from '../types/auth';
import * as api from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<string | null>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  resendVerificationCode: (email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const { user, token } = JSON.parse(savedAuth);
      setUser(user);
      setToken(token);
    }
    setIsLoading(false);
  }, []);

  const saveAuth = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('auth', JSON.stringify({ user, token }));
  };

  const register = async (credentials: RegisterCredentials) => {
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    await api.registerUser({
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
    });
  };

  const verifyEmail = async (email: string, code: string) => {
    const sucess = await api.verifyEmail(email, code);
    if (sucess) {
      return true;
    } else {
      return false;
    }
  };

  const resendVerificationCode = async (email: string) => {
    await api.resendVerificationCode(email);
  };

  const login = async (email: string, password: string) => {
    const { user, token } = await api.loginUser(email, password);
    saveAuth(user, token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        register, 
        verifyEmail,
        resendVerificationCode,
        logout, 
        isLoading 
      }}
    >
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