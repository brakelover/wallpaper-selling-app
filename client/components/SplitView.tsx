import {
  StyleSheet,
  Image,
  View,
  FlatList,
  Dimensions,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import { Wallpaper } from "@/hooks/useWallpapers";
import ImageCard from "@/components/ImageCard";
import DownloadPicture from "@/components/BottomSheet";
import { ThemedView } from "./ThemedView";

interface SplitViewProps {
  wallpapers: Wallpaper[];
  isExplore: boolean;
  switchLike: (url: string, isLiked: boolean) => void;
}

export default function SplitView({
  wallpapers,
  isExplore = true,
  switchLike,
}: SplitViewProps) {
  const [selectedWallpaper, setSelectedWallpaper] = useState<null | Wallpaper>(
    null
  );
  const [wallpaperList, setWallpaperList] = useState(wallpapers);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const width = Dimensions.get("window").width;

  useEffect(() => {
    const handleDeepLink = (url: string) => {
      const path = url.replace(/.*?:\/\//g, ""); // Get the path from the URL
      if (path === "payment-success") {
        setPaymentMessage("Payment Successful!");
      } else if (path === "payment-cancel") {
        setPaymentMessage("Payment Canceled.");
      }
    };

    const subscription = Linking.addListener("url", (event) => {
      handleDeepLink(event.url);
    });

    // Check if the app was opened from a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const pairWallpapers = (wallpapers: Wallpaper[]) => {
    const paired: Array<[Wallpaper, Wallpaper?]> = [];
    for (let i = 0; i < wallpapers.length; i += 2) {
      paired.push([wallpapers[i], wallpapers[i + 1]]);
    }
    return paired;
  };

  const handleSwitchLike = (url: string, isLiked: boolean) => {
    switchLike(url, isLiked);
    // Update the wallpaper list with the new like state
    const updatedWallpapers = wallpaperList.map((wallpaper) =>
      wallpaper.url === url ? { ...wallpaper, liked: isLiked } : wallpaper
    );
    setWallpaperList(updatedWallpapers);

    // Also update the selected wallpaper if it is currently the one being viewed
    if (selectedWallpaper?.url === url) {
      setSelectedWallpaper({ ...selectedWallpaper, liked: isLiked });
    }
  };

  return (
    <>
      <FlatList
        data={pairWallpapers(wallpapers)}
        ListHeaderComponent={
          isExplore ? (
            <Carousel
              loop
              width={width}
              height={width / 1.5}
              autoPlay={true}
              data={wallpapers}
              scrollAnimationDuration={1200}
              renderItem={({ index }) => (
                <View style={styles.carouselItem}>
                  <Image
                    source={{ uri: wallpapers[index].url }}
                    style={styles.backgroundImage}
                    blurRadius={10}
                  />
                  <Image
                    source={{ uri: wallpapers[index].url }}
                    style={styles.image}
                  />
                </View>
              )}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <ThemedView style={styles.row}>
            <ThemedView style={styles.cartItem}>
              <ImageCard
                wallpaper={item[0]}
                onPress={() => {
                  setSelectedWallpaper(item[0]);
                }}
                switchLike={handleSwitchLike}
              />
            </ThemedView>
            {item[1] && (
              <ThemedView style={styles.cartItem}>
                <ImageCard
                  wallpaper={item[1]}
                  onPress={() => {
                    setSelectedWallpaper(item[1] as Wallpaper);
                  }}
                  switchLike={handleSwitchLike}
                />
              </ThemedView>
            )}
          </ThemedView>
        )}
        keyExtractor={(item) => item[0].name}
      />
      {selectedWallpaper && (
        <DownloadPicture
          onClose={() => setSelectedWallpaper(null)}
          wallpaper={selectedWallpaper}
          isExplore={isExplore}
          switchLike={handleSwitchLike}
          paymentMessage={paymentMessage}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  carouselItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  image: {
    width: "40%",
    height: "100%",
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  cartItem: {
    flex: 0.5,
    paddingHorizontal: 5,
  },
});
