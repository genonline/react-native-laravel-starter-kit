import { useSession } from "@/context/authContext";
import { Link } from "expo-router";
import { Button, Text, View } from "react-native";

export default function RegisterScreen() {
  const { session } = useSession();
  console.log("RegisterScreenSession: ", session);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Register Screen</Text>
      <Text>{session}</Text>
      <Link href={"/(tabs)/profile"} asChild>
        <Button title="settings" />
      </Link>
    </View>
  );
}
