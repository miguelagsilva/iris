import { api } from "@/App";
import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getUserProfile = async () => {
    try {
      const res = await api.api.authControllerGetProfileUser();
      if (res.status === 200) {
        return res.data;
      }
      throw new Error(res.statusText);
    } catch (err) {
      console.error(err);
    }
  };

  const signInUser = async (data: { email: string; password: string }) => {
    try {
      const res = await api.api.authControllerSignInUser(data);
      console.log("res.headers", res.headers);
      console.log("res.data", res.data);
      if (res.status === 201) {
        const user = await getUserProfile();
        console.log("user", user);
        setUser(user);
        navigate("/user/dashboard");
        return;
      }
      throw new Error(res.statusText);
    } catch (err) {
      console.error(err);
    }
  };

  const signOutUser = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, signInUser, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
