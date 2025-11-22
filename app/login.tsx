import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";

import { LinkText } from "@/components/ui/link";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <View className="flex justify-center h-full">
      <Card size="md" className="m-3">
        <VStack space="xl">
          <Heading size="2xl">Log in to your account</Heading>
          <Text className="mt-0">Enter your email and password to log in</Text>
          {/* form */}
          {/* Don't have an account? */}
          <HStack className="m-auto">
            <Text className="mt-1 mr-2">Don&#39;t have an account?</Text>
            <Link href={"/register"}>
              <LinkText className="text-black dark:text-white">
                Sign up
              </LinkText>
            </Link>
          </HStack>
        </VStack>
      </Card>
    </View>
  );
}
