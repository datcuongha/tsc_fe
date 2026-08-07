import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, useContext, createContext } from 'react';

import { useRouter } from 'src/routes/hooks';

import { socket } from 'src/utils/socket';

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

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      setUser(decoded);

      const userId = decoded.data.userId;

      socket.connect();

      const join = () => {
        socket.emit('join', userId);
      };

      if (socket.connected) {
        join();
      } else {
        socket.once('connect', join);
      }
    } catch {
      localStorage.removeItem('accessToken');
    }

    setLoading(false);
  }, []);

  const saveToken = (token: string) => {
    localStorage.setItem('accessToken', token);

    const decoded: any = jwtDecode(token);
    console.log('Decoded JWT:', decoded);
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
