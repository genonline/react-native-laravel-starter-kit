import LoadingMessageScreen from "@/components/LoadingMessageScreen";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SessionProvider, useSession } from "@/context/authContext";
import { ThemeSwitcherProvider } from "@/context/themeSwitcherContext";
import { UserProvider } from "@/context/userContext";
import "@/global.css";
import type { Theme } from "@/types/theme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

const InitialLayout = () => {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <LoadingMessageScreen msg="Loading Token" />;
  }

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen
          name="(tabs)"
          options={{ title: "Back", headerShown: false }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen
          name="login"
          options={{ title: "Log in", headerShown: false }}
        />
        <Stack.Screen name="register" options={{ title: "Sign up" }} />
        <Stack.Screen
          name="forgot-password"
          options={{ title: "Forgot Password" }}
        />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSwitcherProvider>
        <ThemeProvider
          value={systemColorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GluestackUIProvider mode={systemColorScheme as Theme}>
            <SafeAreaProvider>
              <SessionProvider>
                <UserProvider>
                  <InitialLayout />
                </UserProvider>
              </SessionProvider>
            </SafeAreaProvider>
          </GluestackUIProvider>
        </ThemeProvider>
      </ThemeSwitcherProvider>
    </QueryClientProvider>
  );
}
