import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter</Text>
      <Text testID="counter-value" style={styles.count}>
        {count}
      </Text>
      <Button
        testID="decrement-button"
        title="Decrement"
        onPress={() => setCount(count - 1)}
      />
      <Button
        testID="increment-button"
        title="Increment"
        onPress={() => setCount(count + 1)}
      />
    </View>
  );
};

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

export default Counter;
