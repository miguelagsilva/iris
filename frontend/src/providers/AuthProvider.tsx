import { api } from "@/services/apiService";
import { SafeOrganizationDto, SafeUserDto } from "@/lib/Api";
import {
  useContext,
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  user: SafeUserDto | null;
  organization: SafeOrganizationDto | null;
  signInUser: (data: { email: string; password: string }) => Promise<void>;
  signOutUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SafeUserDto | null>(null);
  const [organization, setOrganization] = useState<SafeOrganizationDto | null>(
    null,
  );

  const checkUser = async (): Promise<SafeUserDto | null> => {
    try {
      const res = await api.api.authControllerGetProfileUser();
      if (res.status === 200) {
        setUser(res.data);
        return res.data;
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
    setUser(null);
    return null;
  };

  const checkOrganization = async (
    organizationId: string,
  ): Promise<SafeOrganizationDto | null> => {
    try {
      const res = await api.api.organizationsControllerFindOne(organizationId);
      if (res.status === 200) {
        console.log("SETTING ORGANIZATION", res.data);
        setOrganization(res.data);
        return res.data;
      }
    } catch (error) {
      console.error("Error checking organization:", error);
    }
    return null;
  };

  const checkSession = async (): Promise<void> => {
    setIsLoading(true);
    console.log("CHECKING SESSION");
    try {
      const user = await checkUser();
      console.log("DEBUG CHECKUSER USER", user);
      if (user && user.organizationId) {
        await checkOrganization(user.organizationId);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInUser = async (data: {
    email: string;
    password: string;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await api.api.authControllerSignInUser(data);
      if (res.status === 201) {
        await checkSession();
      }
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOutUser = async (): Promise<void> => {
    try {
      await api.api.authControllerSignOutUser();
      console.log("User signed out");
      setUser(null);
      setOrganization(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    checkSession();
    // TODO USE MEMOIZATION TO AVOID HAVING THAT eslint-disable-next-line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: AuthContextType = {
    user,
    organization,
    signInUser,
    signOutUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
