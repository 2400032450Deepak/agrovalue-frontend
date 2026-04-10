import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedUserId = localStorage.getItem('userId');
    if (token && storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role && userData.role.startsWith('ROLE_')) {
        userData.role = userData.role.replace('ROLE_', '');
      }
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      console.log('Login API response:', response.data);
      
      const { token, email: userEmail, role } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        
        // Clean role
        let cleanRole = role;
        if (cleanRole && cleanRole.startsWith('ROLE_')) {
          cleanRole = cleanRole.replace('ROLE_', '');
        }
        
        // Try to get user ID - first check response, then fetch from API
        let userId = response.data.id;
        
        // If no userId in response, try to get from /auth/me endpoint
        if (!userId) {
          try {
            const userInfoResponse = await authAPI.getCurrentUser();
            console.log('User info response:', userInfoResponse.data);
            userId = userInfoResponse.data.id;
          } catch (err) {
            console.error('Could not fetch user info:', err);
          }
        }
        
        // If still no userId, try to extract from email (temporary workaround)
        // You'll need to get this from your backend properly
        if (!userId) {
          console.warn('No user ID found. Please check your backend login response.');
        }
        
        const userData = {
          id: userId || null,
          email: userEmail,
          name: userEmail.split('@')[0],
          role: cleanRole
        };
        
        console.log('Storing user data:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.id) {
          localStorage.setItem('userId', userData.id);
        }
        setUser(userData);
        
        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      toast.success('Registration successful! Please login.');
      return true;
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};