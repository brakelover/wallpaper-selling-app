import {
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { Wallpaper } from "@/hooks/useWallpapers";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface ImageCardProps {
  wallpaper: Wallpaper;
  onPress: () => void;
  switchLike: (url: string, isLiked: boolean) => void;
}

export default function ImageCard({
  wallpaper,
  onPress,
  switchLike,
}: ImageCardProps) {
  const theme = useColorScheme() ?? "light";

  return (
    <Pressable onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: wallpaper.url }} />
        {wallpaper.premium && (
          <View style={[styles.iconContainer, { top: 12, left: 12 }]}>
            <Ionicons
              name={"diamond"}
              size={25}
              color={"#fff"}
              style={styles.icons}
            />
          </View>
        )}
        <Pressable
          onPress={() => switchLike(wallpaper.url, !wallpaper.liked)}
          style={styles.iconContainer}
        >
          <Ionicons
            name={"heart"}
            size={25}
            color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
            style={[styles.icons, { color: wallpaper.liked ? "red" : "white" }]}
          />
        </Pressable>
        <View style={styles.labelContainer}>
          <ThemedText style={styles.label}>{wallpaper.name}</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: 250,
    borderRadius: 20,
  },
  label: {
    color: "white",
  },
  labelContainer: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageContainer: {
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  icons: {
    shadowColor: "#000",
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 100,
  },
});
