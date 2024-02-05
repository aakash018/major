import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { User } from "../types/global";

// Define the shape of your theme context
type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

// Create the initial context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the theme context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Create a provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
