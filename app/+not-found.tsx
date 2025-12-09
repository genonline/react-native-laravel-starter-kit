import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex justify-center items-center h-full">
        <VStack space="xl">
          <VStack space="sm">
            <Heading size="3xl" className="text-center">
              Oops!
            </Heading>
            <Center>
              <Text>That screen is not found.</Text>
            </Center>
          </VStack>
          <Button className="mx-auto" onPress={() => router.navigate("/")}>
            <ButtonText>Go home</ButtonText>
          </Button>
        </VStack>
      </View>
    </>
  );
}
