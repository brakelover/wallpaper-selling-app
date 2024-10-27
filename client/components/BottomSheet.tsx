import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useColorScheme,
  TouchableHighlight,
  Alert,
  Pressable,
  Linking,
  AppState,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Wallpaper } from "@/hooks/useWallpapers";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { ThemedView } from "./ThemedView";

interface DownloadPictureProps {
  onClose: () => void;
  wallpaper: Wallpaper;
  isExplore: boolean;
  switchLike: (url: string, isLiked: boolean) => void;
  paymentMessage: string | null;
}

const DownloadPicture: React.FC<DownloadPictureProps> = ({
  onClose,
  wallpaper,
  isExplore,
  switchLike,
  paymentMessage,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isDownloadSheetOpen, setIsDownloadSheetOpen] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [appState, setAppState] = useState<string>(AppState.currentState);
  const theme = useColorScheme() ?? "light";

  useEffect(() => {
    // Handle URL redirects
    const handleUrl = (event: { url: string }) => {
      const url = decodeURIComponent(event.url);
      const params = new URLSearchParams(url.split("?")[1]);
      const status = params.get("status");
      console.log("Payment Status:", status);
      if (status && paymentStatus !== status) {
        setTimeout(() => {
          setPaymentStatus(status);
          console.log("Updated Payment Status:", status);
        }, 100); // 100ms delay to ensure no status conflicts
      }
    };
    // Event listener for URL changes
    const linkingSubscription = Linking.addEventListener("url", handleUrl);
    // Check initial URL on app start or refresh
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });
    return () => linkingSubscription.remove();
  }, [paymentStatus]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        setTimeout(() => {
          if (paymentStatus) {
            Alert.alert("Payment Status", paymentStatus);
          }
        }, 100);
      }
      setAppState(nextAppState);
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [appState, paymentStatus]);

  const handlePayment = async () => {
    setIsPaymentProcessing(true);
    try {
      const order = {
        amount: wallpaper.price,
        description: "Purchase of wallpaper",
        returnUrl: "exp://localhost:8081/?status=successful",
        cancelUrl: "exp://localhost:8081/?status=canceled",
      };
      const response = await fetch(
        `https://ebd1-42-117-202-214.ngrok-free.app/create-payment-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const responseBody = await response.json();
      if (responseBody.checkoutUrl) {
        Linking.openURL(responseBody.checkoutUrl);
      } else {
        Alert.alert("Error", "Failed to create payment link.");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      Alert.alert("Error", "Failed to process the payment.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  async function handleDownload({ url }: { url: string }) {
    let date = new Date()
      .toISOString()
      .replace(/[:\-T]/g, "")
      .split(".")[0];
    let fileUri = FileSystem.documentDirectory + `${date}.jpg`;

    try {
      // Check for existing permissions
      let permissionResponse = await MediaLibrary.getPermissionsAsync();

      if (!permissionResponse.granted) {
        // Request permission if not granted
        permissionResponse = await MediaLibrary.requestPermissionsAsync();
      }

      if (permissionResponse.granted) {
        // Download and save the image
        await FileSystem.downloadAsync(url, fileUri);
        await MediaLibrary.createAssetAsync(fileUri);
        alert("Image Downloaded Successfully");
        setPaymentStatus(null);
      } else {
        console.log("Download permission not granted");
        alert("Permission required to download images.");
      }
    } catch (err) {
      console.log("FS Error: ", err);
    }
  }

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[isExplore ? "97%" : "100%"]}
        enablePanDownToClose={true}
        handleStyle={{ display: "none" }}
        onClose={onClose}
      >
        <View style={styles.contentContainer}>
          <BottomSheetView
            style={[
              styles.sheetContent,
              {
                backgroundColor:
                  theme === "light"
                    ? Colors.light.background
                    : Colors.dark.background,
              },
            ]}
          >
            <Image
              style={styles.image}
              source={{
                uri: wallpaper.url,
              }}
            />
            <View style={[styles.topBarContainer, { height: 950 }]}>
              <Ionicons
                name={"close"}
                size={40}
                color={"#fff"}
                style={styles.topBarIcons}
                onPress={onClose}
              />
              <Pressable
                onPress={() => switchLike(wallpaper.url, !wallpaper.liked)}
                style={styles.innerTopBar}
              >
                <Ionicons
                  name={"heart"}
                  size={40}
                  color={"#fff"}
                  style={[
                    styles.topBarIcons,
                    { color: wallpaper.liked ? "red" : "white" },
                  ]}
                />
              </Pressable>
            </View>
            <ThemedText style={styles.titleText}>{wallpaper.name}</ThemedText>
            {wallpaper.price > 0 && (
              <ThemedText
                style={[
                  styles.titleText,
                  { marginVertical: 0, fontSize: 25, color: "red" },
                ]}
              >
                {wallpaper.price}đ
              </ThemedText>
            )}
            {paymentMessage && (
              <ThemedView>
                <ThemedText>{paymentMessage}</ThemedText>
              </ThemedView>
            )}
            <TouchableHighlight
              style={styles.downloadButton}
              onPress={() => setIsDownloadSheetOpen(true)}
            >
              <View style={styles.downloadButtonInnerContent}>
                <Text style={{ color: "#fff", fontSize: 16 }}>
                  Get wallpaper
                </Text>
              </View>
            </TouchableHighlight>
          </BottomSheetView>
        </View>
      </BottomSheet>

      {isDownloadSheetOpen && (
        <BottomSheet
          snapPoints={["20%"]}
          enablePanDownToClose={true}
          onClose={() => setIsDownloadSheetOpen(false)}
        >
          <BottomSheetView style={styles.downloadSheet}>
            {wallpaper.premium ? (
              <>
                {paymentStatus === "PAID" ? (
                  <TouchableHighlight
                    style={[styles.innerButton, { marginBottom: 50 }]}
                    onPress={() => handleDownload({ url: wallpaper.url })}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Ionicons name={"download"} size={20} color={"#fff"} />
                      <Text style={styles.innerButtonText}>Download</Text>
                    </View>
                  </TouchableHighlight>
                ) : (
                  <TouchableHighlight
                    style={[
                      styles.innerButton,
                      { backgroundColor: "#D23E23", marginBottom: 50 },
                    ]}
                    onPress={handlePayment}
                  >
                    <Text style={[styles.innerButtonText, { color: "#fff" }]}>
                      {isPaymentProcessing
                        ? "Processing..."
                        : `Buy wallpaper: ${wallpaper.price}đ`}
                    </Text>
                  </TouchableHighlight>
                )}
              </>
            ) : (
              <TouchableHighlight
                style={styles.innerButton}
                onPress={() => handleDownload({ url: wallpaper.url })}
              >
                <View style={{ flexDirection: "row" }}>
                  <Ionicons name={"download"} size={20} color={"#fff"} />
                  <Text style={styles.innerButtonText}>Download</Text>
                </View>
              </TouchableHighlight>
            )}
          </BottomSheetView>
        </BottomSheet>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  sheetContent: {
    flex: 1,
  },
  image: {
    height: "80%",
    width: "100%",
  },
  topBarContainer: {
    position: "absolute",
    paddingTop: 15,
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
  },
  innerTopBar: {
    flex: 0.43,
    marginTop: "auto",
    gap: 15,
  },
  topBarIcons: {
    shadowColor: "#000",
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 100,
  },
  titleText: {
    marginVertical: 10,
    paddingTop: 10,
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
  },
  downloadButton: {
    backgroundColor: "black",
    paddingVertical: 15,
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
  downloadSheet: {
    padding: 20,
    alignItems: "center",
  },
  innerButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    margin: 10,
    width: 320,
    alignItems: "center",
  },
  innerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default DownloadPicture;
