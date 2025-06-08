import { Text, View } from "react-native";

/**
 * Displays a centered message prompting the user to edit the screen.
 *
 * Renders a full-screen container with a message centered both vertically and horizontally.
 */
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text testID="home">Home 🧋</Text>
    </View>
  );
}
