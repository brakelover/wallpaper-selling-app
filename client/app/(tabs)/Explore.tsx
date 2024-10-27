import { SafeAreaView, Platform, StatusBar, StyleSheet } from "react-native";
import React from "react";
import { useWallpapers } from "@/hooks/useWallpapers";
import SplitView from "@/components/SplitView";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";

export default function Explore() {
  const { wallpapers, switchLike } = useWallpapers(); // Get switchLike here

  return (
    <ThemedSafeAreaView style={styles.container}>
      <SplitView
        wallpapers={wallpapers}
        isExplore={true}
        switchLike={switchLike}
      />
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
