import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

axios.defaults.withCredentials = true;

interface UserData {
  id: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const publicPaths = ["/", "/login", "/signup"];

    if (publicPaths.includes(location.pathname)) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, { withCredentials: true });
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [isAuthenticated, location.pathname]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};