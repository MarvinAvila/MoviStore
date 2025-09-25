import { useState, useEffect, type ReactNode } from 'react';
import apiClient from '../api/axiosConfig';
import type { User } from '../types';
import { AuthContext } from '../hooks/useAuth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const { data } = await apiClient.get('/users/profile');
          setUser(data);
        } catch (error) {
          console.error("Failed to fetch user profile, logging out.", error);
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
          delete apiClient.defaults.headers.common['Authorization'];
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    const userResponse = await apiClient.get('/users/profile');
    setUser(userResponse.data);
  };

  // AÑADE ESTA FUNCIÓN DE REGISTER
  const register = async (name: string, email: string, password: string) => {
    const { data } = await apiClient.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    const userResponse = await apiClient.get('/users/profile');
    setUser(userResponse.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, // AÑADE register AQUÍ
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};