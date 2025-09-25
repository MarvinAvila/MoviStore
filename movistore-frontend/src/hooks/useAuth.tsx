import { createContext, useContext } from 'react';
import type { User } from '../types';

// 1. Definir la forma del Contexto
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>; // AÑADE ESTA LÍNEA
  logout: () => void;
  isLoading: boolean;
}

// 2. Crear y exportar el Contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Crear y exportar el Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};