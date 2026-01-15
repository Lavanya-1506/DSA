import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, getAuthToken, getAuthUser, setAuthToken, clearAuth } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser = getAuthUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const register = async (firstName, lastName, email, password, passwordConfirm) => {
    try {
      const response = await authAPI.register(firstName, lastName, email, password, passwordConfirm);
      setAuthToken(response.token, response.user);
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      setAuthToken(response.token, response.user);
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.user);
      setAuthToken(token, response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
