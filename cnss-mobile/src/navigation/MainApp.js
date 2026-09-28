import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MainApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MainApp (disabled)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 16, color: "#374151" },
});
