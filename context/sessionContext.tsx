import { clearApiToken } from "@/api/api";
import { logout } from "@/api/auth";
import { useStorageState } from "@/hooks/useStorageState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, type PropsWithChildren, useContext } from "react";

const SessionContext = createContext<{
  setSession: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  setSession: (token) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(SessionContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const queryClient = useQueryClient();

  return (
    <SessionContext.Provider
      value={{
        setSession: (token) => {
          setSession(token);
        },
        signOut: () => {
          logout().finally(() => {
            Promise.resolve().then(() => queryClient.clear()); // React Query cache clear
            setSession(null);
            clearApiToken(); // clears api Bearer token
            AsyncStorage.clear(); // clears light and dark mode
          });
        },
        session,
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
