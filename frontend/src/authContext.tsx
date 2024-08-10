/*
import { createContext, useState } from "react";

const AuthContext = createContext(null);

function AuthProvider(props: any) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [session, setSession] = useState(null);

  const login = (jwtToken) => {
    setIsLoggedIn(true);
    setToken(jwtToken);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
  };

  const value = {
    isLoggedIn,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={null} {...props} />;
}

export { AuthContext, AuthProvider };
  */
