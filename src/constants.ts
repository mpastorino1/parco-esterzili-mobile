import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ImageProps } from "react-native";

export const MAP_BOUNDS = {
  ne: [9.12, 39.33],
  sw: [9.05, 39.29],
};

export type Place = {
  id: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  image?: ImageProps["source"];
  videoUrl?: string;
  type: "poi" | "cross";
  mediaType?: ("image" | "audio" | "video")[];
  beacon: {
    id: string;
    uuid: string;
    major?: number;
    minor?: number;
    triggerDistance: number;
  };
};

export const PLACES: Place[] = [
  {
    id: "casa",
    // title: "Cascata maggiore",
    coordinates: {
      longitude: 9.097738936348684,
      latitude: 39.297275921677354,
    },
    image: require("./assets/cascata.jpg"),
    mediaType: ["image", "audio"],
    icon: "waterfall",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 4,
      minor: 8143,
      triggerDistance: 3,
    },
  },
  {
    id: "casa-mebi",
    // title: "Grotte",
    coordinates: {
      longitude: 9.097324281082722,
      latitude: 39.29620687437821,
    },
    image: require("./assets/grotteMaimone.jpg"),
    mediaType: ["image", "audio"],
    icon: "image-filter-hdr",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "E4507BF5-F125-4972-AEF0-5FCA35225FAB",
      major: 4,
      minor: 8147,
      triggerDistance: 3,
    },
  },
];

export const POI = PLACES.filter((p) => p.type === "poi");

// this is a map of beacon id to place, for quick lookup
export const POI_MAP_BY_BEACON_MINOR = POI.reduce((acc, poi) => {
  if (poi.beacon.minor) {
    acc[poi.beacon.minor] = poi;
  }
  return acc;
}, {} as Record<string, Place>);

export const POI_BOUNDS = MAP_BOUNDS;

export function usePlace(placeId?: Place["id"]) {
  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (!placeId) return;
    const place = PLACES.find((p) => p.id === placeId);
    setPlace(place || null);
  }, [placeId]);

  return place;
}
