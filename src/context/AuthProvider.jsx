// src/context/AuthProvider.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Import from the new file

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email && password.length >= 6) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/catalog');
      return { success: true };
    }
    
    throw new Error('Invalid credentials');
  };

  const register = async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (userData.name && userData.email && userData.password) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/catalog');
      return { success: true };
    }

    throw new Error('Registration failed');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };
  
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};