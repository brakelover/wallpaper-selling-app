import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableHighlight,
  useColorScheme,
  Pressable,
  Appearance,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";

export default function Account() {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedView style={styles.topBar}>
        <ThemedText style={styles.headerTitle}>Panels</ThemedText>
        <ThemedText>Sign in to save your data</ThemedText>
      </ThemedView>
      <ThemedView style={styles.contentContainer}>
        <AuthButton
          label="Sign in"
          icon={
            <Ionicons
              name="logo-google"
              size={24}
              color={theme === "light" ? "#000" : Colors.dark.text}
            />
          }
        />
        <AuthButton
          label="Sign in"
          icon={
            <Ionicons
              name="logo-apple"
              size={24}
              color={theme === "light" ? "#000" : Colors.dark.text}
            />
          }
        />
        <ThemedView style={{ padding: 20 }}>
          <ThemedText style={styles.headerTitle}>Settings</ThemedText>
          <ThemedText>Theme</ThemedText>
          <ThemedView style={styles.themeSelectorContainer}>
            <ThemeButton title="Light" selected={true} colorTheme={"light"} />
            <ThemeButton title="Dark" selected={false} colorTheme={"dark"} />
            <ThemeButton title="System" selected={false} colorTheme={null} />
          </ThemedView>
        </ThemedView>
        <ThemedView style={{ padding: 20 }}>
          <ThemedText style={styles.headerTitle}>About</ThemedText>
          <ThemedView
            style={[styles.themeSelectorContainer, { flexDirection: "column" }]}
          >
            <Pressable>
              <ThemedText style={styles.aboutText}>About</ThemedText>
            </Pressable>
            <Pressable>
              <ThemedText style={styles.aboutText}>Privacy Policy</ThemedText>
            </Pressable>
            <Pressable>
              <ThemedText style={styles.aboutText}>Term of Service</ThemedText>
            </Pressable>
            <Pressable>
              <ThemedText style={styles.aboutText}>Licenses</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

function ThemeButton({
  title,
  selected,
  colorTheme,
}: {
  selected: boolean;
  title: string;
  colorTheme: "dark" | "light" | null;
}) {
  const theme = useColorScheme() ?? "light";
  return (
    <Pressable
      style={[
        styles.themeSelectorChild,
        {
          borderColor:
            theme === "light"
              ? Colors.light.tabIconDefault
              : Colors.dark.tabIconDefault,
        },
      ]}
      onPress={() => Appearance.setColorScheme(colorTheme)}
    >
      <ThemedText>{title}</ThemedText>
    </Pressable>
  );
}

function AuthButton({ label, icon }: { label: String; icon: any }) {
  const theme = useColorScheme() ?? "light";
  return (
    <TouchableHighlight
      style={[
        styles.downloadButton,
        {
          backgroundColor: theme,
          borderColor: theme === "light" ? Colors.light.text : Colors.dark.icon,
        },
      ]}
      onPress={() => console.log("Download button pressed")}
    >
      <ThemedView style={styles.downloadButtonInnerContent}>
        {icon}
        <ThemedText style={{ fontSize: 16 }}>{label}</ThemedText>
      </ThemedView>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  downloadButton: {
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    width: 320,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButtonInnerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  topBar: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  themeSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  themeSelectorChild: {
    flex: 0.33,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
  },
  aboutText: {
    margin: 10,
    fontSize: 18,
  },
});
