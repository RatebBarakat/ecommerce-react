import React, { createContext, useEffect, useState } from 'react';
import axios from "../axios";
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions,setPermissions] = useState({});

  const fetchUser = async () => {
    !isLoading && (setIsLoading(true));
    try {
      const { data } = await axios.get('/api/user');
      setUser(data.user);
      setPermissions(data.permissions);
      console.log('data :>> ', data);
      setIsVerified(!!data.user.email_verified_at); 
    } catch (error) {
      setUser(null);
      setIsVerified(false); 
    } finally {
      setIsLoading(false);
    }
  }

  const logout = () => {
    axios.post('/logout').then(() => {
      setUser(null);
    })
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  const value = { user, isLoading, permissions, isVerified, logout, fetchUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };