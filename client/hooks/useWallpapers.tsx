import { useState, useEffect } from "react";
import Data from "@/constants/Data";

export interface Wallpaper {
  url: string;
  name: string;
  price: number;
  liked: boolean;
  suggested: boolean;
  library: boolean;
  premium: boolean;
}

export function useWallpapers() {
  const rawData = Data();
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(rawData);
  const [likedWallpapers, setLikedWallpapers] = useState<Wallpaper[]>([]);
  const [suggestedWallpapers, setSuggestedWallpapers] = useState<Wallpaper[]>(
    []
  );
  const [libraryWallpapers, setLibraryWallpapers] = useState<Wallpaper[]>([]);

  const switchLike = (url: string, isLiked: boolean) => {
    setWallpapers((prevWallpapers) =>
      prevWallpapers.map((wallpaper) =>
        wallpaper.url === url ? { ...wallpaper, liked: isLiked } : wallpaper
      )
    );
  };

  useEffect(() => {
    setLikedWallpapers(wallpapers.filter((wallpaper) => wallpaper.liked));
    setSuggestedWallpapers(wallpapers.filter((wallpaper) => wallpaper.premium));
    setLibraryWallpapers(wallpapers.filter((wallpaper) => !wallpaper.premium));
  }, [wallpapers]);

  return {
    wallpapers,
    switchLike,
    likedWallpapers,
    suggestedWallpapers,
    libraryWallpapers,
  };
}
