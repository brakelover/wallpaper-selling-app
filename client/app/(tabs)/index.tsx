import { Platform, StatusBar, StyleSheet, useColorScheme } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SplitView from "@/components/SplitView";
import { useWallpapers } from "@/hooks/useWallpapers";

const Tab = createMaterialTopTabNavigator();

export default function ForYou() {
  const theme = useColorScheme();
  const {
    libraryWallpapers,
    likedWallpapers,
    suggestedWallpapers,
    switchLike,
  } = useWallpapers();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme === "light" ? "white" : "black",
            borderTopColor: theme === "light" ? "white" : "black",
          },
        ],
        tabBarActiveTintColor: theme === "light" ? "blue" : "white",
        tabBarInactiveTintColor: theme === "light" ? "gray" : "gray",
      }}
    >
      <Tab.Screen name="Available">
        {() => (
          <LibraryScreen
            wallpapers={libraryWallpapers}
            switchLike={switchLike}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Liked">
        {() => (
          <LikedScreen wallpapers={likedWallpapers} switchLike={switchLike} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Suggested">
        {() => (
          <SuggestedScreen
            wallpapers={suggestedWallpapers}
            switchLike={switchLike}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function LibraryScreen({ wallpapers, switchLike }: any) {
  return (
    <SplitView
      wallpapers={wallpapers}
      isExplore={false}
      switchLike={switchLike}
    />
  );
}

function LikedScreen({ wallpapers, switchLike }: any) {
  return (
    <SplitView
      wallpapers={wallpapers}
      isExplore={false}
      switchLike={switchLike}
    />
  );
}

function SuggestedScreen({ wallpapers, switchLike }: any) {
  return (
    <SplitView
      wallpapers={wallpapers}
      isExplore={false}
      switchLike={switchLike}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
