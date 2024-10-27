import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { Children } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

export default function ThemedSafeAreaView({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: any;
}) {
  const theme = useColorScheme() ?? "light";
  return (
    <SafeAreaView
      style={{
        backgroundColor:
          theme === "light" ? Colors.light.background : Colors.dark.background,
        ...style,
      }}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
