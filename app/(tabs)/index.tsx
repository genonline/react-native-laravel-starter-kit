import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { InfoIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUser } from "@/context/userContext";
import { View } from "react-native";

export default function Index() {
  const user = useUser();
  return (
    <View className="m-3 gap-3">
      <Card>
        <Heading>Welcome, {user.name}</Heading>
      </Card>
      <Alert action="info" variant="solid">
        <AlertIcon as={InfoIcon} />
        <VStack className="flex-1">
          <Text className="font-semibold text-typography-900">
            You&#39;re logged in!
          </Text>
          <AlertText className="text-typography-900" size="sm">
            Build something amazing!
          </AlertText>
        </VStack>
      </Alert>
    </View>
  );
}
