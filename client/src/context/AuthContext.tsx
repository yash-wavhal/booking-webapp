import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

axios.defaults.withCredentials = true;

interface UserData {
  _id: string;
  isAdmin: boolean;
  username: string;
  email: string;
  createdAt: string;
  pfp: string;
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
  setIsAuthenticated: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, { withCredentials: true });
        setUser(res.data.user);
        // console.log(user);
        setIsAuthenticated(true);
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.warn("⚠️ Unauthorized. User is not logged in.");
        } else {
          console.error("❌ An unexpected error occurred:", err);
        }
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};