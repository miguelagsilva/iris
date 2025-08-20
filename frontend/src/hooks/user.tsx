import { useAuth } from "./auth";

export const useUser = () => {
  const { user } = useAuth();
  if (!user) {
    throw new Error("User not found");
  }
  return { user };
};
