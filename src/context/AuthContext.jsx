import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMemberStore } from '../store/useMemberStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session from localStorage on app startup
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('library_auth');
      if (savedAuth) {
        setUser(JSON.parse(savedAuth));
      }
    } catch (e) {
      console.error('Failed to read library_auth from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logs in a user by checking admin credentials or matching against registered member details.
   * @param {string} usernameOrEmail - The user's input email, member ID, or admin username.
   * @param {string} password - User's matching credentials or fallback member ID.
   * @returns {boolean} True if login succeeds, false otherwise.
   */
  const login = (usernameOrEmail, password) => {
    // 1. Check default administrative credentials
    if (usernameOrEmail === 'admin' && password === 'admin') {
      const adminUser = { username: 'admin', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('library_auth', JSON.stringify(adminUser));
      return adminUser;
    }

    // 2. Query registered members from the member store
    const members = useMemberStore.getState().members;
    const matchedMember = members.find(
      (m) => m.email === usernameOrEmail || m.memberNo === usernameOrEmail
    );

    // If a member record matches, check credentials (memberNo is the default password fallback)
    if (matchedMember) {
      const isPasswordCorrect = 
        password === matchedMember.memberNo || 
        (matchedMember.password && password === matchedMember.password);

      if (isPasswordCorrect) {
        const memberUser = {
          username: matchedMember.fullName,
          role: 'member',
          memberId: matchedMember.id,
          email: matchedMember.email,
          memberNo: matchedMember.memberNo,
        };
        setUser(memberUser);
        localStorage.setItem('library_auth', JSON.stringify(memberUser));
        return memberUser;
      }
    }

    return null;
  };

  /**
   * Cleans the active session state and purges local storage authentication data.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('library_auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isLoading: loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
