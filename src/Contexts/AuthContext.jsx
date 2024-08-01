// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../Firebase'; // Adjust the path as needed
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        setIsAdmin(idTokenResult.claims.admin || false);
      }
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const value = { currentUser, isAdmin, signup, login, logout };

  if (loading) return <div>Loading...</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
