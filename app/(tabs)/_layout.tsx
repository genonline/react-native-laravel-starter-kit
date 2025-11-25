import { Icon } from "@/components/ui/icon";
import { Tabs } from "expo-router";
import { House, User } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon size="md" as={House} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Icon size="md" as={User} color={color} />,
        }}
      />
    </Tabs>
  );
}
