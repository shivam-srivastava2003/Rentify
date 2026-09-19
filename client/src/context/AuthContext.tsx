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
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set default axios configuration
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  axios.defaults.withCredentials = true; // For cookies

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await axios.get('/auth/me');
        if (response.data.success) {
          setCurrentUser(response.data.data);
        }
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = (user: User) => {
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
