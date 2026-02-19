import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ImageProps } from "react-native";

export const MAP_BOUNDS = {
  ne: [9.2892, 39.7849],
  sw: [9.2813, 39.776],
};

export const ESTERZILI_CENTER = {
  latitude: 39.779149,
  longitude: 9.284741,
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
    id: "poi-1",
    coordinates: { longitude: 9.2836, latitude: 39.78165 },
    image: require("./assets/cascata.jpg"),
    mediaType: ["image", "audio"],
    icon: "map-marker",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "ACFD065E-C3C0-11E3-9BBE-1A514932AC01",
      major: 1004,
      minor: 26908,
      triggerDistance: 3,
    },
  },
  {
    id: "poi-2",
    coordinates: { longitude: 9.28442, latitude: 39.78088 },
    image: require("./assets/cascata.jpg"),
    mediaType: ["image", "audio"],
    icon: "map-marker",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "ACFD065E-C3C0-11E3-9BBE-1A514932AC01",
      major: 1004,
      minor: 26909,
      triggerDistance: 3,
    },
  },
  {
    id: "poi-3",
    coordinates: { longitude: 9.286, latitude: 39.77995 },
    image: require("./assets/cascata.jpg"),
    mediaType: ["image", "audio"],
    icon: "map-marker",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "ACFD065E-C3C0-11E3-9BBE-1A514932AC01",
      major: 1004,
      minor: 26910,
      triggerDistance: 3,
    },
  },
  {
    id: "poi-4",
    coordinates: { longitude: 9.28508, latitude: 39.779622 },
    image: require("./assets/cascata.jpg"),
    mediaType: ["image", "audio"],
    icon: "map-marker",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "ACFD065E-C3C0-11E3-9BBE-1A514932AC01",
      major: 1004,
      minor: 26911,
      triggerDistance: 3,
    },
  },
  {
    id: "poi-5",
    coordinates: { longitude: 9.28612, latitude: 39.78098 },
    image: require("./assets/cascata.jpg"),
    mediaType: ["image", "audio"],
    icon: "map-marker",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "ACFD065E-C3C0-11E3-9BBE-1A514932AC01",
      major: 1004,
      minor: 26912,
      triggerDistance: 3,
    },
  },
  {
    id: "poi-6",
    coordinates: { longitude: 9.28535, latitude: 39.780215 },
    image: require("./assets/cascata.jpg"),
    mediaType: ["image", "audio"],
    icon: "map-marker",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "ACFD065E-C3C0-11E3-9BBE-1A514932AC01",
      major: 1004,
      minor: 26913,
      triggerDistance: 3,
    },
  },
  {
    id: "poi-7",
    coordinates: { longitude: 9.286933, latitude: 39.78285 },
    image: require("./assets/cascata.jpg"),
    mediaType: ["image", "audio"],
    icon: "map-marker",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "ACFD065E-C3C0-11E3-9BBE-1A514932AC01",
      major: 1004,
      minor: 26914,
      triggerDistance: 3,
    },
  },
  {
    id: "poi-8",
    coordinates: { longitude: 9.2872, latitude: 39.77862 },
    image: require("./assets/cascata.jpg"),
    mediaType: ["image", "audio"],
    icon: "map-marker",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "ACFD065E-C3C0-11E3-9BBE-1A514932AC01",
      major: 1004,
      minor: 26915,
      triggerDistance: 3,
    },
  },
  {
    id: "poi-9",
    coordinates: { longitude: 9.28385, latitude: 39.77798 },
    image: require("./assets/cascata.jpg"),
    mediaType: ["image", "audio"],
    icon: "map-marker",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "ACFD065E-C3C0-11E3-9BBE-1A514932AC01",
      major: 1004,
      minor: 26916,
      triggerDistance: 3,
    },
  },
  {
    id: "poi-10",
    coordinates: { longitude: 9.28325, latitude: 39.77932 },
    image: require("./assets/cascata.jpg"),
    mediaType: ["image", "audio"],
    icon: "map-marker",
    type: "poi",
    beacon: {
      id: "all",
      uuid: "ACFD065E-C3C0-11E3-9BBE-1A514932AC01",
      major: 1004,
      minor: 26917,
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

export type BeaconRegionConfig = {
  id: string;
  uuid: string;
  major?: number;
  minor?: number;
};

export const BEACON_REGIONS: BeaconRegionConfig[] = Array.from(
  new Map(
    PLACES.map((place) => {
      const { beacon } = place;
      const key = [
        beacon.uuid,
        beacon.major ?? "all",
        beacon.minor ?? "all",
      ].join("-");
      return [
        key,
        {
          id: `region-${place.id}`,
          uuid: beacon.uuid,
          ...(beacon.major !== undefined ? { major: beacon.major } : {}),
          ...(beacon.minor !== undefined ? { minor: beacon.minor } : {}),
        } satisfies BeaconRegionConfig,
      ];
    })
  ).values()
);

export function usePlace(placeId?: Place["id"]) {
  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (!placeId) return;
    const place = PLACES.find((p) => p.id === placeId);
    setPlace(place || null);
  }, [placeId]);

  return place;
}
