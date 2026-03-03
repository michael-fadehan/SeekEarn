import React, { createContext, useContext } from 'react';
import useSolanaAuth from '../hooks/useSolanaAuth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useSolanaAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};