import { useThemeSwitcher } from "@/context/themeSwitcherContext";
import { useColorScheme } from "react-native";
import { Card } from "./ui/card";
import { Icon, MoonIcon, SunIcon } from "./ui/icon";
import { Pressable } from "./ui/pressable";
import { Text } from "./ui/text";

export default function ToggleTheme() {
  const { toggleTheme } = useThemeSwitcher();
  const systemColorScheme = useColorScheme();

  return (
    <Card className="flex flex-row justify-between">
      <Text>Toggle Dark Mode:</Text>
      <Pressable onPress={toggleTheme}>
        <Icon
          as={systemColorScheme === "dark" ? SunIcon : MoonIcon}
          size="xl"
          className="stroke-background-700 fill-background-700"
        />
      </Pressable>
    </Card>
  );
}
