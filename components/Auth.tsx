import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, AppState, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    console.log(data);
    if (data) router.push("/");
    setLoading(false);
  }

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View className="mt-10 p-3">
      <View className="py-1 self-stretch gap-1">
        <Text>Email</Text>
        <Input
          onChangeText={(text: string) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          aria-labelledby="email"
        />
      </View>
      <View className="py-1 self-stretch gap-1">
        <Text>Password</Text>
        <Input
          onChangeText={(text: string) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
          aria-labelledby="password"
        />
      </View>
      <View className="py-1 self-stretch mt-5 gap-2">
        <Button 
          disabled={loading} 
          onPress={signInWithEmail}
          variant="default"
          className="flex-row justify-center items-center"
        >
          <Text className="text-white font-semibold">Sign in</Text>
        </Button>
        <Button 
          disabled={loading} 
          onPress={logout}
          variant="secondary"
          className="flex-row justify-center items-center"
        >
          <Text className="font-semibold">Logout</Text>
        </Button>
        <Button 
          disabled={loading} 
          onPress={signUpWithEmail}
          variant="outline"
          className="flex-row justify-center items-center"
        >
          <Text className="font-semibold">Sign up</Text>
        </Button>
      </View>
    </View>
  );
}
