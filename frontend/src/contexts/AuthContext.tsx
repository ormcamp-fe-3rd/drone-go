import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

interface AuthContextProp{
  isAuth: boolean|null;
  setIsAuth: Dispatch<SetStateAction<boolean | null>>
}

export const AuthContext = createContext<AuthContextProp>({
  isAuth: null,
  setIsAuth: () => null
});


interface AuthProviderProp {
  children: ReactNode;
}
export default function AuthProvider({ children }: AuthProviderProp) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  return <AuthContext.Provider value={{ isAuth, setIsAuth }}>{children}</AuthContext.Provider>;
}
