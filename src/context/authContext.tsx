import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, useContext, createContext } from 'react';

import { useRouter } from 'src/routes/hooks';

type AuthContextType = {
  user: any;
  loading: boolean;
  saveToken: (token: string) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<any>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser(decoded);
      } catch {
        localStorage.removeItem('accessToken');
      }
    }

    setLoading(false); // 🔥 bắt buộc
  }, []);

  const saveToken = (token: string) => {
    localStorage.setItem('accessToken', token);

    const decoded: any = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    router.push('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ user, saveToken, logout, loading, setUser }}>
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
