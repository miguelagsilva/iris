import { SignedInEmployeeDto, SignInEmployeeDto, SignInUserDto } from "@/types/api";
import { SignedInUserDto } from "@/types/auth";
import { createContext } from "react";

export interface AuthContextType {
  user: SignedInUserDto | null;
  employee: SignedInEmployeeDto | null;
  handleUserSignIn: (signInUserDto: SignInUserDto) => Promise<void>;
  handleUserSignOut: () => Promise<void>;
  handleEmployeeSignIn: (signInEmployeeDto: SignInEmployeeDto) => Promise<void>;
  handleEmployeeSignOut: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
