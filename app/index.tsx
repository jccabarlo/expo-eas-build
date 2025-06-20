import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useQueryProducts } from "@/services/useQueryProducts";
import { Thought, ThoughtStorage } from "@/utils/storage";
import { useRouter } from "expo-router";
import { Bell, Plus, Settings } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  FadeOutRight,
  Layout,
  SlideInRight,
  runOnJS,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Displays a centered message prompting the user to edit the screen.
 *
 * Renders a full-screen container with a message centered both vertically and horizontally.
 */

export default function Index() {
  const router = useRouter();
  const { data, isLoading } = useQueryProducts();
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Category 1", "Category 2"];

  useEffect(() => {
    loadThoughts();
  }, []);

  const loadThoughts = async () => {
    const savedThoughts = await ThoughtStorage.getThoughts();
    setThoughts(savedThoughts);
  };

  const deleteThought = async (id: string) => {
    await ThoughtStorage.deleteThought(id);
    loadThoughts();
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Thought",
      "Are you sure you want to delete this thought?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteThought(id),
        },
      ]
    );
  };

  const filteredThoughts = thoughts.filter(
    (thought) =>
      selectedCategory === "All" || thought.category === selectedCategory
  );

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return <Text className="text-center mt-20">Loading...</Text>;
  }

  const renderThought = ({ item, index }: { item: Thought; index: number }) => {
    const swipeGesture = Gesture.Pan().onEnd((event) => {
      if (event.translationX < -100) {
        runOnJS(handleDelete)(item.id);
      }
    });

    return (
      <GestureDetector gesture={swipeGesture}>
        <Animated.View
          entering={FadeInDown.delay(index * 100)}
          exiting={FadeOutRight}
          layout={Layout.springify()}
        >
          <Button
            className="flex-row items-start bg-[#2a2a2a] rounded-xl p-4 mb-3"
            variant="ghost"
          >
            <View className="w-10 h-10 rounded-full bg-[#333] justify-center items-center mr-3">
              <Bell size={20} color="#666" />
            </View>
            <View className="flex-1">
              <Text
                className="text-white text-base leading-snug mb-1"
                numberOfLines={2}
              >
                {item.content}
              </Text>
              <Text className="text-[#666] text-xs">
                {formatTime(item.timestamp)}
              </Text>
            </View>
          </Button>
        </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a1a]">
      <View className="flex-row justify-between items-center px-5 py-4">
        <Text className="text-white text-3xl font-semibold">Thoughts</Text>
        <Button
          className="p-2"
          onPress={() => router.push("/login")}
          variant="ghost"
        >
          <Settings size={24} color="#fff" />
        </Button>
      </View>

      <View className="flex-row px-5 pb-5 gap-3">
        {categories.map((category) => (
          <Button
            key={category}
            className={`px-4 py-2 rounded-full bg-[#333] ${
              selectedCategory === category ? "bg-white" : ""
            }`}
            onPress={() => setSelectedCategory(category)}
            variant="ghost"
          >
            <Text
              className={`text-sm font-medium text-[#999] ${
                selectedCategory === category ? "text-black" : ""
              }`}
            >
              {category}
            </Text>
          </Button>
        ))}
      </View>

      <FlatList
        data={filteredThoughts}
        renderItem={renderThought}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-24"
        showsVerticalScrollIndicator={false}
      />

      <Animated.View
        entering={SlideInRight.delay(500)}
        className="absolute bottom-8 right-5"
      >
        <Button
          className="w-14 h-14 rounded-full bg-white justify-center items-center shadow-lg shadow-black"
          onPress={() => router.push("/new-thought")}
          variant="default"
        >
          <Plus size={28} color="#000" />
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}
