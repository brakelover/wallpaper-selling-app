import { Platform, StatusBar, StyleSheet, useColorScheme } from "react-native";
import React from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

// All file in app folder will display in a tabs

export default function _layout() {
  const theme = useColorScheme() ?? "light";
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme === "light" ? "blue" : "#6a5afa",
        tabBarInactiveTintColor: theme === "light" ? "gray" : "white",
        tabBarStyle: {
          backgroundColor: theme === "light" ? "white" : "black",
          borderTopColor: theme === "light" ? "white" : "black",
          paddingTop: 5,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarLabelStyle: {
          paddingBottom: 5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "For you",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="explore" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Slot: the place where the page content will be rendered

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
