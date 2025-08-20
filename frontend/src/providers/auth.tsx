import { AuthContext, AuthContextType } from "@/contexts/auth";
import { getEmployeeProfile, getUserProfile, signInEmployee, signInUser, signOutEmployee, signOutUser } from "@/lib/api";
import { SignedInEmployeeDto, SignInEmployeeDto, SignInUserDto } from "@/types/api";
import { SignedInUserDto } from "@/types/auth";
import {
  useState,
  ReactNode,
  useEffect,
} from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SignedInUserDto | null>(null);
  const [employee, setEmployee] = useState<SignedInEmployeeDto | null>(null);

  const handleEmployeeSignIn = async (signInEmployeeDto: SignInEmployeeDto) => {
    if (loading) return
    setLoading(true);
    try {
      await signInEmployee(signInEmployeeDto);
      const employee = await getEmployeeProfile();
      setEmployee(employee);
    } catch {
      throw new Error("Failed to sign in employee");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSignOut = async () => {
    setLoading(true);
    try {
      await signOutEmployee();
      setEmployee(null);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  const handleUserSignIn = async (signInUserDto: SignInUserDto) => {
    if (loading) return
    setLoading(true);
    console.log("CHECKING SESSION");
    try {
      await signInUser(signInUserDto);
      const user = await getUserProfile();
      setUser(user);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  const handleUserSignOut = async () => {
    setLoading(true);
    console.log("CHECKING SESSION");
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const checkUserSession = async () => {
      setLoading(true);
      console.log("CHECKING SESSION USER")
      try {
        const user = await getUserProfile();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    const checkEmployeeSession = async () => {
      setLoading(true);
      console.log("CHECKING SESSION EMPLOYEE")
      try {
        const employee = await getEmployeeProfile();
        setEmployee(employee);
      } catch {
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    if (location.pathname.startsWith("/user")) {
      checkUserSession();
    } else if (location.pathname.startsWith("/employee")) {
      checkEmployeeSession();
    }
  }, []);

  const contextValue: AuthContextType = {
    user,
    employee,
    handleEmployeeSignIn,
    handleEmployeeSignOut,
    handleUserSignIn,
    handleUserSignOut,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
