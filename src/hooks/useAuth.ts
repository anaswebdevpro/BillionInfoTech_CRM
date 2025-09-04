import { useContext } from 'react';
import AuthContext from '../context/AuthContext/AuthContext';
import type { AuthContextType } from '../types';

/**
 * Custom hook to use the AuthContext
 * @returns AuthContext value containing user and token
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
