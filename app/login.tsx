import Auth from "@/components/Auth";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  return (
    <SafeAreaView className="flex-1">
      <Auth />
    </SafeAreaView>
  );
}
