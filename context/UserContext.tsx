'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/lib/apiEndpoints';
import { get } from '@/utilities/AxiosInterceptor';

const apiUrl = 'https://server.momenz.in';
// const apiUrl = 'http://localhost:5000';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
  mobile?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
  triggerFetchUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [shouldFetchUser, setShouldFetchUser] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await get<any>(`${apiUrl}${API_ENDPOINTS.AUTH.GET_USER}`, {
        withCredentials: true,
      });

      if (response?.success && response?.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
  };

  const triggerFetchUser = () => {
    setShouldFetchUser(true);
  };

  useEffect(() => {
    if (shouldFetchUser) {
      fetchUser();
      setShouldFetchUser(false);
    }
  }, [shouldFetchUser]);

  useEffect(() => {
    // Only set loading to false initially, don't fetch user
    if (!shouldFetchUser) {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, fetchUser, clearUser, triggerFetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};