import { createContext, useState, useEffect } from "react";
import axios from "axios";
import LoadingScreen from "@/components/Extra/Loader";
import { showToast } from "@/components/Extra/ToastMessage";

const AuthURL = process.env.NEXT_PUBLIC_API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${AuthURL}/auth`, {
          withCredentials: true,
        });
        if (res.data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (checkingAuth) return <LoadingScreen message="Cargando página..." />;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
