import React, { createContext, useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout, updateUserProfile } from "../redux/userSlice";
import apiClient from "../utils/api";

interface AuthContextType {
  isCheckingAuth: boolean;
  user: any;
}

const AuthContext = createContext<AuthContextType>({
  isCheckingAuth: true,
  user: null
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { currentUser, token } = useAppSelector((state) => state.user);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const activeToken =
        token || sessionStorage.getItem("orbito_token") || localStorage.getItem("orbito_token");

      if (!activeToken) {
        if (isMounted) setIsCheckingAuth(false);
        return;
      }

      try {
        const response = await apiClient.get("/auth/me");
        if (isMounted && response.data?.result) {
          dispatch(updateUserProfile(response.data.result));
        }
      } catch (err: any) {
        // If 401 or invalid token, clear session
        if (err.response?.status === 401) {
          dispatch(logout());
        }
      } finally {
        if (isMounted) setIsCheckingAuth(false);
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [dispatch, token]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent dark:border-indigo-400"></div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Validating session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isCheckingAuth, user: currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
