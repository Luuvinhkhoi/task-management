import { createContext, useContext } from "react";

export const AuthContext = createContext({
  signOut: () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);
