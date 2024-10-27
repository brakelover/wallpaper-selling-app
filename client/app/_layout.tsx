// app/_layout.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" initialParams={{ paymentStatus: null }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
