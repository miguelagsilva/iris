import { useAuth } from "./auth";

export const useEmployee = () => {
  const { employee } = useAuth();
  if (!employee) {
    throw new Error("Employee not found");
  }
  return { employee };
};
