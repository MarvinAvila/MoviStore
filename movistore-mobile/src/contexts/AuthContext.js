import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { setAuthToken } from '../api/apiClient';

// Crear el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          setAuthToken(storedToken);
          try {
            const { data } = await apiClient.get('/users/profile');
            setUser(data);
          } catch (error) {
            console.error("Failed to fetch user profile, logging out.", error);
            await AsyncStorage.removeItem('token');
            setUser(null);
            setToken(null);
            setAuthToken(null);
          }
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      await AsyncStorage.setItem('token', data.token);
      setToken(data.token);
      setAuthToken(data.token);
      const userResponse = await apiClient.get('/users/profile');
      setUser(userResponse.data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await apiClient.post('/auth/register', { name, email, password });
      await AsyncStorage.setItem('token', data.token);
      setToken(data.token);
      setAuthToken(data.token);
      const userResponse = await apiClient.get('/users/profile');
      setUser(userResponse.data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setAuthToken(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};