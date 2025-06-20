import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { OCRService } from "@/utils/ocr";
import { ThoughtStorage } from "@/utils/storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  Bookmark,
  FileText,
  Home,
  Image as ImageIcon,
  Plus,
  Search,
  User,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInDown,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewThoughtScreen() {
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("");

  const handleImageUpload = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access camera roll is required!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setIsProcessing(true);
        setProcessingText("Extracting text from image...");

        try {
          const extractedText = await OCRService.extractTextFromImage(
            result.assets[0].uri
          );
          setContent(extractedText);
        } catch (error) {
          Alert.alert(
            "Error",
            "Failed to extract text from image. Please try again."
          );
        } finally {
          setIsProcessing(false);
          setProcessingText("");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
      setIsProcessing(false);
      setProcessingText("");
    }
  };

  const handleDocumentUpload = async () => {
    Alert.alert(
      "Coming Soon",
      "Document upload feature will be available soon!"
    );
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please enter some content before saving.");
      return;
    }

    try {
      await ThoughtStorage.saveThought({
        content: content.trim(),
        category: "Category 1",
        timestamp: Date.now(),
      });

      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save thought. Please try again.");
    }
  };

  const handleDiscard = () => {
    if (content.trim()) {
      Alert.alert(
        "Discard Changes",
        "Are you sure you want to discard your changes?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a1a]">
      <Animated.View
        entering={FadeInUp}
        className="flex-row justify-between items-center px-5 py-4 border-b border-[#333]"
      >
        <Button onPress={handleDiscard} className="p-2" variant="ghost">
          <X size={24} color="#fff" />
        </Button>
        <Text className="text-white text-lg font-semibold">New Thought</Text>
        <View className="w-10" />
      </Animated.View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200)} className="mt-6">
          <Text className="text-white text-base font-semibold mb-4">
            Upload
          </Text>

          <Button
            className="flex-row items-center bg-[#2a2a2a] rounded-xl p-4 mb-3"
            onPress={handleImageUpload}
            disabled={isProcessing}
            variant="ghost"
          >
            <ImageIcon size={24} color="#fff" />
            <Text className="text-white text-base ml-3">Upload Image</Text>
          </Button>

          <Button
            className="flex-row items-center bg-[#2a2a2a] rounded-xl p-4 mb-3"
            onPress={handleDocumentUpload}
            disabled={isProcessing}
            variant="ghost"
          >
            <FileText size={24} color="#fff" />
            <Text className="text-white text-base ml-3">Upload Document</Text>
          </Button>
        </Animated.View>

        {isProcessing && (
          <Animated.View entering={SlideInDown} className="mt-6">
            <Text className="text-white text-base font-semibold mb-4">
              Processing
            </Text>
            <View className="flex-row items-center mb-3">
              <ActivityIndicator size="small" color="#fff" />
              <Text className="text-white text-sm ml-2">{processingText}</Text>
            </View>
            <View className="h-1 bg-[#333] rounded-sm overflow-hidden">
              <View className="h-full w-[70%] bg-white rounded-sm" />
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(400)} className="mt-6">
          <Text className="text-white text-base font-semibold mb-3">
            Enter your thought here
          </Text>
          <Input
            className="bg-[#2a2a2a] rounded-xl p-4 text-base text-white min-h-[120px] text-top"
            value={content}
            onChangeText={setContent}
            placeholder="Start typing..."
            placeholderTextColor="#666"
            multiline
            textAlignVertical="top"
          />
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(600)} className="px-5 pb-5">
        <View className="flex-row justify-between mb-5">
          <Button
            className="flex-1 bg-[#333] rounded-xl p-4 mr-2 items-center"
            onPress={handleDiscard}
            variant="ghost"
          >
            <Text className="text-white text-base font-semibold">Discard</Text>
          </Button>

          <Button
            className={`flex-1 bg-white rounded-xl p-4 ml-2 items-center ${
              !content.trim() ? "bg-[#666]" : ""
            }`}
            onPress={handleSave}
            disabled={!content.trim() || isProcessing}
            variant="default"
          >
            <Text className="text-black text-base font-semibold">Save</Text>
          </Button>
        </View>

        <View className="flex-row justify-around items-center py-3">
          <Button
            className="p-2"
            onPress={() => router.push("/")}
            variant="ghost"
          >
            <Home size={24} color="#666" />
          </Button>
          <Button className="p-2" variant="ghost">
            <Search size={24} color="#666" />
          </Button>
          <Button className="p-2 bg-[#333] rounded-lg" variant="ghost">
            <Plus size={24} color="#fff" />
          </Button>
          <Button className="p-2" variant="ghost">
            <Bookmark size={24} color="#666" />
          </Button>
          <Button className="p-2" variant="ghost">
            <User size={24} color="#666" />
          </Button>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
