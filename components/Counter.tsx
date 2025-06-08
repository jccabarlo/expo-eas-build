import { CounterProvider, useCounterContext } from "@/context/CounterContext";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const CounterChild = () => {
  const { count, increment, decrement } = useCounterContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter</Text>
      <Text testID="counter-value" style={styles.count}>
        {count}
      </Text>
      <Button testID="decrement-button" title="Decrement" onPress={decrement} />
      <Button testID="increment-button" title="Increment" onPress={increment} />
    </View>
  );
};

export default function Counter() {
  return (
    <CounterProvider>
      <CounterChild />
    </CounterProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  count: {
    fontSize: 48,
    marginBottom: 20,
  },
});
