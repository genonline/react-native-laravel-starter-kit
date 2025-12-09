import { getUser } from "@/api/user";
import LoadingMessageScreen from "@/components/LoadingMessageScreen";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Button, ButtonText } from "@/components/ui/button";
import { InfoIcon } from "@/components/ui/icon";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext } from "react";
import { View } from "react-native";
import { useSession } from "./sessionContext";

const UserContext = createContext<User | null>(null);

export function useUser() {
  const value = useContext(UserContext);
  if (!value) {
    throw new Error("useUser must be wrapped in a <UserProvider />");
  }

  return value;
}

export function UserProvider({ children }: PropsWithChildren) {
  const { session } = useSession();

  const { isPending, isError, error, data, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
    enabled: !!session,
  });

  if (isPending && session) {
    return <LoadingMessageScreen msg="Loading User" />;
  }

  if (isError) {
    return (
      <View className="flex justify-center items-center h-screen gap-3">
        <Alert action="error" variant="solid">
          <AlertIcon as={InfoIcon} />
          <AlertText>Error: {error.message}</AlertText>
        </Alert>
        <Button
          className="mt-5"
          onPress={() => {
            refetch();
          }}
        >
          <ButtonText>Retry</ButtonText>
        </Button>
      </View>
    );
  }

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
}
