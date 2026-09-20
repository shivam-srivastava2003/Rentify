import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export type Role = 'USER' | 'OWNER' | 'ADMIN' | null;

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  whatsapp?: string;
  permanentAddress?: string;
  city?: string;
  businessName?: string;
  propertyLocation?: string;
  unitCount?: string;
  gender?: string;
  avatar?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  role: Role;
  login: (user: User, token?: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set default axios configuration
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://rentify-backend-wgze.onrender.com/api';
axios.defaults.withCredentials = true; // For cookies

// Add request interceptor to attach Bearer token from localStorage to every outgoing API call
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rentify_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await axios.get('/auth/me');
        if (response.data.success) {
          setCurrentUser(response.data.data);
        }
      } catch (error) {
        localStorage.removeItem('rentify_token');
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = (user: User, token?: string) => {
    if (token) {
      localStorage.setItem('rentify_token', token);
    }
    setCurrentUser(user);
  };

  const updateUser = (user: User) => {
    setCurrentUser(user);
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('rentify_token');
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || null,
        login,
        logout,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
