import { ReactNode, useEffect,useState } from "react";

import { AuthContext } from "./AuthContext";

interface AuthProviderProp {
  children: ReactNode;
}
export default function AuthProvider({ children }: AuthProviderProp) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsAuth(!!token);
    };

    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
