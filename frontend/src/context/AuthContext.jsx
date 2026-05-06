import { createContext, useContext, useMemo, useState } from 'react';
import { api, unwrap } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [guideUser, setGuideUser] = useState(() => JSON.parse(localStorage.getItem('guideUser') || 'null'));
  const [adminUser, setAdminUser] = useState(() => JSON.parse(localStorage.getItem('adminUser') || 'null'));

  const value = useMemo(() => ({
    guideUser,
    adminUser,
    async guideLogin(email, password) {
      const data = unwrap(await api.post('/auth/guide/login', { email, password }));
      localStorage.setItem('guideToken', data.token);
      localStorage.setItem('guideUser', JSON.stringify(data.user));
      setGuideUser(data.user);
    },
    async guideRegister(name, email, password) {
      const data = unwrap(await api.post('/auth/guide/register', { name, email, password }));
      localStorage.setItem('guideToken', data.token);
      localStorage.setItem('guideUser', JSON.stringify(data.user));
      setGuideUser(data.user);
    },
    guideLogout() {
      localStorage.removeItem('guideToken');
      localStorage.removeItem('guideUser');
      setGuideUser(null);
    },
    async adminLogin(email, password) {
      const data = unwrap(await api.post('/auth/admin/login', { email, password }));
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      setAdminUser(data.user);
    },
    adminLogout() {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setAdminUser(null);
    }
  }), [guideUser, adminUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
