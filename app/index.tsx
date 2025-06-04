import { useQueryProducts } from "@/services/useQueryProducts";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

/**
 * Displays a centered message prompting the user to edit the screen.
 *
 * Renders a full-screen container with a message centered both vertically and horizontally.
 */

export default function Index() {
  const router = useRouter();
  const { data, isLoading } = useQueryProducts();

  if (isLoading) {
    return <Text className="text-center mt-20">Loading...</Text>;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text onPress={() => router.push("/login")}>Home 🧋</Text>
    </View>
  );
}
