import { createContext, Dispatch, SetStateAction } from "react";

interface AuthContextProp{
  isAuth: boolean|null;
  setIsAuth: Dispatch<SetStateAction<boolean | null>>
}

export const AuthContext = createContext<AuthContextProp>({
  isAuth: null,
  setIsAuth: () => null
});


