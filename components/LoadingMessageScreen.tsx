import { View } from "react-native";
import { Spinner } from "./ui/spinner";
import { Text } from "./ui/text";

export default function LoadingMessageScreen(props: { msg: string }) {
  return (
    <View className="flex justify-center items-center h-full gap-3">
      <Spinner size="large" color="black" />
      <Text>{props.msg}</Text>
    </View>
  );
}
