import { useQueryProducts } from "@/services/useQueryProducts";
import { Thought, ThoughtStorage } from "@/utils/storage";
import { useRouter } from "expo-router";
import { Bell, Plus, Settings } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
          <TouchableOpacity style={styles.thoughtItem} activeOpacity={0.7}>
            <View style={styles.thoughtIcon}>
              <Bell size={20} color="#666" />
            </View>
            <View style={styles.thoughtContent}>
              <Text style={styles.thoughtText} numberOfLines={2}>
                {item.content}
              </Text>
              <Text style={styles.thoughtTime}>
                {formatTime(item.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thoughts</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/login")}>
          <Settings size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredThoughts}
        renderItem={renderThought}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Animated.View
        entering={SlideInRight.delay(500)}
        style={styles.fabContainer}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/new-thought")}
          activeOpacity={0.8}
        >
          <Plus size={28} color="#000" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
  },
  settingsButton: {
    padding: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#333",
  },
  categoryButtonActive: {
    backgroundColor: "#fff",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#999",
  },
  categoryTextActive: {
    color: "#000",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  thoughtItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  thoughtIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  thoughtContent: {
    flex: 1,
  },
  thoughtText: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 22,
    marginBottom: 4,
  },
  thoughtTime: {
    fontSize: 12,
    color: "#666",
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
